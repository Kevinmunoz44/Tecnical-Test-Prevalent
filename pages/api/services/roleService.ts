import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const roleService = {

    getAllRoles: async () => {
        return await prisma.role.findMany();
    },

    getRoleById: async (id: number) => {
        if(id!) throw new Error('Role not found')
        return await prisma.role.findUnique({
            where: {
                id
            },
        })
    },

    createRole: async (name: string) => {
        if (!name || name.trim() === '') {
            throw new Error('Role name cannot be empty');
        }
        console.log("Role name received:", name);
        const newRole = await prisma.role.create({
            data: { name: name.trim() },
        });
        if (!newRole) {
            throw new Error('Failed to create role');
        }
        return newRole;
    },

    updateRole: async (id: number, name: string) => {
        if (!id) {
            throw new Error('Role Id is required')
        }

        if (!name || name.trim() === '') {
            throw new Error('Role name cannot be empty')
        }
        const transaction = await prisma.role.update({
            where: { id },
            data: { name },
        });
        return transaction;
    },

    deleteRole: async (id: number) => {
        if (!id) throw new Error('Role Id is required')
        const roleId = Number(id);
        return await prisma.role.delete({
            where: { id: roleId },
        });
    }

}