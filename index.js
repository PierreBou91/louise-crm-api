const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLBoolean,
} = require("graphql");
const cors = require("cors");
const pool = require("./db");

require("dotenv").config();
PORT = process.env.PORT;

const app = express();

const authors = [
  { id: 1, name: "J. K. Rowling" },
  { id: 2, name: "J. R. R. Tolkien" },
  { id: 3, name: "Brent Weeks" },
];

const books = [
  { id: 1, name: "Harry Potter and the Chamber of Secrets", authorId: 1 },
  { id: 2, name: "Harry Potter and the Prisoner of Azkaban", authorId: 1 },
  { id: 3, name: "Harry Potter and the Goblet of Fire", authorId: 1 },
  { id: 4, name: "The Fellowship of the Ring", authorId: 2 },
  { id: 5, name: "The Two Towers", authorId: 2 },
  { id: 6, name: "The Return of the King", authorId: 2 },
  { id: 7, name: "The Way of Shadows", authorId: 3 },
  { id: 8, name: "Beyond the Shadows", authorId: 3 },
];

// app.get("/db", async (req, res) => {
//   try {
//     // const value = await pool.query(
//     //   "INSERT INTO persons (name) VALUES ('bibi');"
//     // );
//     const value = await pool.query("SELECT * FROM roles where id = 1;");
//     res.send(value.rows[0]);
//   } catch (error) {
//     console.error(error);
//   }
// });

const PersonType = new GraphQLObjectType({
  name: "Person",
  description:
    "This represents a person that can be a user or a contact of a user",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    first_name: { type: GraphQLNonNull(GraphQLString) },
    last_name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    password_hash: { type: GraphQLString },
    is_user: { type: GraphQLBoolean },
    owner_id: { type: GraphQLInt },
    team: { type: GraphQLString },
    organisation: { type: GraphQLString },
    role: {
      type: RoleType,
      resolve: async (person) => {
        const value = await pool.query(
          `SELECT * FROM roles r WHERE id = (SELECT role_id FROM persons WHERE id = ${person.id});`
        );
        console.log(value.rows);
        const role = value.rows[0];
        return role;
      },
    },
    is_admin: { type: GraphQLBoolean },
    created_at: { type: GraphQLString },
    created_by: { type: GraphQLNonNull(GraphQLInt) },
    is_deleted: { type: GraphQLBoolean },
  }),
});

const RoleType = new GraphQLObjectType({
  name: "Role",
  description: "The RoleType is a specific role in an organisation",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    label: { type: GraphQLNonNull(GraphQLString) },
    team_id: { type: GraphQLInt },
    created_at: { type: GraphQLString },
    created_by: { type: GraphQLNonNull(GraphQLInt) },
    is_deleted: { type: GraphQLBoolean },
  }),
});

const OrgType = new GraphQLObjectType({
  name: "Organisation",
  description: "The RoleType is a specific role in an organisation",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    label: { type: GraphQLNonNull(GraphQLString) },
    team_id: { type: GraphQLInt },
    created_at: { type: GraphQLString },
    created_by: { type: GraphQLNonNull(GraphQLInt) },
    is_deleted: { type: GraphQLBoolean },
  }),
});

const BookType = new GraphQLObjectType({
  name: "Book",
  description: "This is a Book written by an author",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: (book) => {
        return authors.find((author) => author.id === book.authorId);
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "Author",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books: {
      type: GraphQLList(BookType),
      resolve: (author) => {
        return books.filter((book) => book.authorId === author.id);
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    persons: {
      type: new GraphQLList(PersonType),
      description: "List of persons",
      resolve: async () => {
        const value = await pool.query(
          "SELECT p.id, p.first_name, p.last_name, p.email, p.phone, p.password_hash, p.is_user, p.owner_id, t.label AS team, o.org_name AS organisation, p.is_admin, p.created_at, p.created_by, p.is_deleted FROM persons AS p LEFT JOIN teams AS t ON t.id = p.team_id LEFT JOIN organisations AS o ON o.id = p.org_id;"
        );
        return value.rows;
      },
    },
    books: {
      type: new GraphQLList(BookType),
      description: "List of books",
      resolve: () => books,
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: "List of authors",
      resolve: () => authors,
    },
    book: {
      type: BookType,
      description: "A single Book",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => books.find((book) => book.id === args.id),
    },
    author: {
      type: AuthorType,
      description: "Single author",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) =>
        authors.find((author) => author.id === args.id),
    },
  }),
});

const RootMutationType = new GraphQLObjectType({
  name: "Mutations",
  description: "Root Mutation",
  fields: () => ({
    addBook: {
      type: BookType,
      description: "add a book",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const book = {
          id: books.length + 1,
          name: args.name,
          authorId: args.authorId,
        };
        books.push(book);
        return book;
      },
    },
    addAuthor: {
      type: AuthorType,
      description: "add an author",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const author = {
          id: authors.length + 1,
          name: args.name,
        };
        authors.push(author);
        return author;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

app.use(
  "/",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.use(cors());

app.listen(PORT, () => {
  console.log("listening on " + PORT);
});
