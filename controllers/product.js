import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import shortid from "shortid";

let productList = [];
let userList = [];

export const createProduct = (req, res) => {
  try {
    shortid.characters(
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@"
    );
    const id = shortid.generate();
    const { name, desc } = req.body;
    const productWithId = { id: id, name: name, desc: desc };
    productList.push(productWithId);
    res.status(200).send(productList);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error: error });
  }
};

export const getAllProduct = (req, res) => {
  try {
    res.status(200).send(productList);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error: error });
  }
};

export const getParticularProduct = (req, res) => {
  const { id } = req.params;
  try {
    const foundProduct = productList.find((product) => {
      if (product.id == id) {
        return product;
      }
    });
    res.status(200).send(foundProduct);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error: error });
  }
};

export const deleteProduct = (req, res) => {
  const { id } = req.params;
  try {
    productList = productList.filter((product) => {
      if (product.id != id) {
        return product;
      }
    });
    res.status(200).send(`Deleted Product with id ${id}`);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error: error });
  }
};

export const updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, desc } = req.body;
  try {
    let productToBeUpdated = productList.find((product) => {
      if (product.id == id) {
        return product;
      }
    });

    if (name) {
      productToBeUpdated.name = name;
    }
    if (desc) {
      productToBeUpdated.desc = desc;
    }

    res.status(200).send(`Updated the product with id ${id}`);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error: error });
  }
};

export const registerUser = (req, res) => {
  const { email, name, password } = req.body;
  try {
    const salt = bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hash(password, salt);
    const isAlreadyPresent = userList.find({ email: email });
    if (isAlreadyPresent) {
      res.status(500).send("Login User Already Exist");
    }
    shortid.characters(
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@"
    );
    const id = shortid.generate();

    userList.push({
      id: id,
      name: name,
      email: email,
      password: hashedPassword,
    });
    res.status(200).send(`User Created with id ${id}`);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error: error });
  }
};

export const loginUser = (req, res) => {
  const { email, password } = req.body;
  const user = userList.find({ email: email });
  if (!user) {
    res.status(404).send({ message: "User Not Found" });
  }
  const isCorrect = bcrypt.compare(password, user.password);
  if (!isCorrect) {
    res.status(500).send({ message: "Password Incorrect" });
  }

  const token = jwt.sign({ id: user.id }, "secret", {
    expiresIn: "1h",
  });

  res.status(200).send({ message: "User logged In", token: token });
};

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, 'secret');
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Unauthorized' });
  }
}