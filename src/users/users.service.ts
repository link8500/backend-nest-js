import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

const userSelect = {
  id: true,
  name: true,
  email: true,
  tenantId: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const password = await bcrypt.hash(createUserDto.password, 10);
      return await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          password,
          tenantId: createUserDto.tenantId,
        },
        select: userSelect,
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  findAll() {
    return this.prisma.user.findMany({
      select: userSelect,
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });

    if (!user) {
      throw new NotFoundException(`No existe un usuario con id ${id}`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const data: Prisma.UserUpdateInput = {
      ...(updateUserDto.name !== undefined && { name: updateUserDto.name }),
      ...(updateUserDto.email !== undefined && { email: updateUserDto.email }),
      ...(updateUserDto.tenantId !== undefined && {
        tenant: { connect: { id: updateUserDto.tenantId } },
      }),
    };

    if (updateUserDto.password !== undefined) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    try {
      return await this.prisma.user.update({
        where: { id },
        data,
        select: userSelect,
      });
    } catch (error) {
      this.handlePrismaError(error, id);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.user.delete({ where: { id } });
      return { message: "Usuario eliminado" };
    } catch (error) {
      this.handlePrismaError(error, id);
    }
  }

  private handlePrismaError(error: unknown, id?: string): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new ConflictException("El correo electrónico ya está registrado");
      }

      if (error.code === "P2025") {
        throw new NotFoundException(
          id
            ? `No existe un usuario con id ${id}`
            : "El tenant indicado no existe",
        );
      }
    }

    throw error;
  }
}
