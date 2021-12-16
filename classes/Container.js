export default class Container {
  constructor(database, table) {
    this.database = database;
    this.table = table;

    if (table === "products") {
      this.database.schema.hasTable("products").then((result) => {
        if (!result) {
          //No exist table, need created
          database.schema
            .createTable("products", (table) => {
              table.increments();
              table.string("title").notNullable();
              table.string("description").notNullable();
              table.integer("code").notNullable();
              table.integer("price").notNullable().defaultTo(0);
              table.string("thumbnail").notNullable();
              table.integer("stock").notNullable().defaultTo(10);
              table.timestamps(true, true);
            })
            .then((result) => {
              console.log("Products table created");
            });
        }
      });
    } else if (table === "chats") {
      this.database.schema.hasTable("chats").then((result) => {
        if (!result) {
          this.database.schema
            .createTable("chats", (table) => {
              table.increments();
              table.string("email").notNullable();
              table.string("message").notNullable();
              table.timestamps(true, true);
            })
            .then((result) => {
              console.log("Chats table created successfully.");
            });
        }
      });
    }
  }
  //////////Métodos
  async getProducts() {
    try {
      const products = await this.database.select().table("products");
      return { status: "success", payload: products };
    } catch (err) {
      console.log(`Error: ${err}`);
      return { status: "error", message: err.message };
    }
  }
  async getProductById(id) {
    try {
      const product = await this.database
        .select()
        .table("products")
        .where("id", id)
        .first();
      if (!product) throw new Error("Product not found.");
      return { status: "success", payload: product };
    } catch (err) {
      console.log(`Error: ${err}`);
      return { status: "error", message: err.message };
    }
  }
  registerProduct = async (product) => {
    try {
      let exists = await this.database
        .table("products")
        .select()
        .where("code", product.code)
        .first();
      if (exists)
        return { status: "error", message: "code product already exists" };
      let result = await this.database.table("products").insert(product);
      return {
        status: "success",
        payload: `Congratulations, product registred with id: ${result[0]} `,
      };
    } catch (err) {
      //console.log(err)
      return { status: "error", message: err };
    }
  };
  async updateProduct(id, item) {
    try {
      const updated = await this.database
        .update(item)
        .table("products")
        .where("id", id);
      if (!updated) throw new Error("Product update error.");
      return {
        status: "success",
        payload: "Product has been updated successfully.",
      };
    } catch (err) {
      console.log(`Error: ${err}`);
      return { status: "error", message: err.message };
    }
  }

  async deleteProduct(id) {
    try {
      const deleted = await this.database
        .del()
        .table("products")
        .where("id", id);
      if (!deleted) throw new Error("Product delete error.");
      return {
        status: "success",
        payload: "Product has been deleted successfully.",
      };
    } catch (err) {
      console.log(`Error: ${err}`);
      return { status: "error", message: err.message };
    }
  }

  /////
  //socket
  ////
  /////
  async saveMessage(message) {
    try {
      await this.database.insert(message).table("chats");
      return {
        status: "success",
        payload: "Chat has been saved successfully.",
      };
    } catch (err) {
      console.log(`Error: ${err}`);
      return { status: "error", message: err.message };
    }
  }
  async getMessages() {
    try {
      const chats = await this.database.select().table("chats");
      return { status: "success", payload: chats };
    } catch (err) {
      console.log(`Error: ${err}`);
      return { status: "error", message: err.message };
    }
  }
}
