const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = express();
const port = 3000;
const cors = require("cors");
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Bem vindo!");
});

// criar usuarios
app.post("/user", async (req, res) => {
  if (req.body.email) {
    const hasUser = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });
    if (hasUser) {
      return res.status(400).json({ error: "Usuário já cadastrado" });
    }
  }
  const user = await prisma.user.create({
    data: req.body,
  });
  res.status(201).json(user);
});

//listar usuarios
app.get("/user", async (req, res) => {
  const users = await prisma.user.findMany();
  res.status(200).json(users);
});

// deletar usuario
app.delete("/user/:id", async (req, res) => {
  const { id } = req.params;
  const hasUser = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });
  if (!hasUser) return res.status(401).json({ message: "Usuario nao existe!" });

  await prisma.user.delete({
    where: {
      id: Number(id),
    },
  });

  res.status(200).json({ message: "Usuario deletado com sucesso!" });
});

// atualizar um usuario
app.patch("/user/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const user = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data,
  });
  res.status(200).json({ user, message: "Usuario atualizado com sucesso!" });
});

// listar um unico usuario
app.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });
  res.status(200).json(user);
});

app.listen(port, () => {
  console.log(`Rodando na porta  ${port}`);
});
