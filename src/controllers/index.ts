import { PrismaClient } from "@prisma/client";
// import { PrismaClient } from "../generated/prisma";

function connectPrismaClient(url: string) {
	const prisma = new PrismaClient({
		datasourceUrl: url,
	});
	return prisma;
}

export default connectPrismaClient;
