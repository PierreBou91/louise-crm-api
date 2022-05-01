// Express and dev require
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

// Graphql require
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

// Mongo require
const { upsertCustomFields, deleteCustomField } = require("./mongo");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

// Postgres require
const {
  selectCommentsdFromPersonId,
  selectCreatedByFromPersonId,
  selectActionsFromPersonId,
  selectOwnerFromPersonId,
  selectRoleFromPersonId,
  selectTeamFromPersonId,
  selectOrgFromPersonId,
  selectCreatedByFromOrgId,
  selectOwnerFromOrgId,
  selectCreatedByFromTeamId,
  selectOrgFromTeamId,
  selectCreatedByFromRoleId,
  selectTeamFromRoleId,
  selectCreatedByFromCommentId,
  selectCreatedByFromActionId,
  selectContactFromActionId,
  selectAllPersons,
  selectAllOrgs,
  selectAllTeams,
  selectAllRoles,
  selectAllComments,
  selectAllActions,
} = require("./db/db");

PORT = process.env.PORT;

app.post("/upsert", jsonParser, async (req, res) => {
  res.send(await upsertCustomFields(req.body));
});
app.post("/delfield", jsonParser, async (req, res) => {
  res.send(await deleteCustomField(req.body));
});

// app.get("/db", async (req, res) => {
//   try {
//     res.send(await selectAllPersons());
//   } catch (error) {
//     console.error(error);
//   }
// });

// Graphql Types
const PersonType = new GraphQLObjectType({
  name: "Person",
  description:
    "This represents a person that can be a user or a contact of a user.",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLString) },
    first_name: { type: GraphQLNonNull(GraphQLString) },
    last_name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    password_hash: { type: GraphQLString },
    is_user: { type: GraphQLBoolean },
    comments: {
      type: GraphQLList(CommentType),
      resolve: (person) => {
        return selectCommentsdFromPersonId(person.id);
      },
    },
    owner: {
      type: PersonType,
      resolve: (person) => {
        return selectOwnerFromPersonId(person.id);
      },
    },
    team: {
      type: TeamType,
      resolve: (person) => {
        return selectTeamFromPersonId(person.id);
      },
    },
    organisation: {
      type: OrgType,
      resolve: (person) => {
        return selectOrgFromPersonId(person.id);
      },
    },
    role: {
      type: RoleType,
      resolve: (person) => {
        return selectRoleFromPersonId(person.id);
      },
    },
    actions: {
      type: GraphQLList(ActionType),
      resolve: (person) => {
        return selectActionsFromPersonId(person.id);
      },
    },
    is_admin: { type: GraphQLBoolean },
    created_at: { type: GraphQLString },
    created_by: {
      type: PersonType,
      resolve: (person) => {
        return selectCreatedByFromPersonId(person.id);
      },
    },
    is_deleted: { type: GraphQLBoolean },
  }),
});

const OrgType = new GraphQLObjectType({
  name: "Organisation",
  description: "This represents an organisation",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLString) },
    org_name: { type: GraphQLNonNull(GraphQLString) },
    is_client: { type: GraphQLBoolean },
    owner: {
      type: PersonType,
      resolve: (org) => {
        return selectOwnerFromOrgId(org.id);
      },
    },
    created_at: { type: GraphQLString },
    created_by: {
      type: PersonType,
      resolve: (org) => {
        return selectCreatedByFromOrgId(org.id);
      },
    },
    is_deleted: { type: GraphQLBoolean },
  }),
});

const TeamType = new GraphQLObjectType({
  name: "Team",
  description: "This represents a team that belongs to an organisation",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLString) },
    label: { type: GraphQLNonNull(GraphQLString) },
    owner_org: {
      type: OrgType,
      resolve: (team) => {
        return selectOrgFromTeamId(team.id);
      },
    },
    created_at: { type: GraphQLString },
    created_by: {
      type: PersonType,
      resolve: (team) => {
        return selectCreatedByFromTeamId(team.id);
      },
    },
    is_deleted: { type: GraphQLBoolean },
  }),
});

const ActionType = new GraphQLObjectType({
  name: "Action",
  description: "This represents an action that is assigned to a person",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLString) },
    label: { type: GraphQLNonNull(GraphQLString) },
    target_date: { type: GraphQLString },
    is_done: { type: GraphQLBoolean },
    contact: {
      type: PersonType,
      resolve: (action) => {
        return selectContactFromActionId(action.id);
      },
    },
    created_at: { type: GraphQLString },
    created_by: {
      type: PersonType,
      resolve: (action) => {
        return selectCreatedByFromActionId(action.id);
      },
    },
    is_deleted: { type: GraphQLBoolean },
  }),
});

const RoleType = new GraphQLObjectType({
  name: "Role",
  description: "This represents a specific role in a team.",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLString) },
    label: { type: GraphQLNonNull(GraphQLString) },
    team: {
      type: TeamType,
      resolve: (role) => {
        return selectTeamFromRoleId(role.id);
      },
    },
    created_at: { type: GraphQLString },
    created_by: {
      type: PersonType,
      resolve: (role) => {
        return selectCreatedByFromRoleId(role.id);
      },
    },
    is_deleted: { type: GraphQLBoolean },
  }),
});

const CommentType = new GraphQLObjectType({
  name: "Comment",
  description: "This is a comment about a user.",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLString) },
    content: { type: GraphQLString },
    created_at: { type: GraphQLString },
    created_by: {
      type: PersonType,
      resolve: (comment) => {
        return selectCreatedByFromCommentId(comment.id);
      },
    },
    is_deleted: { type: GraphQLBoolean },
  }),
});

// Root queries and mutations
const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    persons: {
      type: new GraphQLList(PersonType),
      description: "List of all the persons in the database",
      resolve: () => {
        return selectAllPersons();
      },
    },
    organisations: {
      type: new GraphQLList(OrgType),
      description: "List of all the organisations in the database",
      resolve: () => {
        return selectAllOrgs();
      },
    },
    teams: {
      type: new GraphQLList(TeamType),
      description: "List of all the teams in the database",
      resolve: () => {
        return selectAllTeams();
      },
    },
    roles: {
      type: new GraphQLList(RoleType),
      description: "List of all the roles in the database",
      resolve: () => {
        return selectAllRoles();
      },
    },
    comments: {
      type: new GraphQLList(CommentType),
      description: "List of all the comments in the database",
      resolve: () => {
        return selectAllComments();
      },
    },
    actions: {
      type: new GraphQLList(ActionType),
      description: "List of all the actions in the database",
      resolve: () => {
        return selectAllActions();
      },
    },
    person: {
      type: PersonType,
      description: "Query a single person by id",
      args: {
        id: { type: GraphQLString },
        first_name: { type: GraphQLString },
      },
      resolve: async (person, args) => {
        for (var arg in args) {
          console.log(arg);
          console.log(args[arg]);
        }
        // const query = await pool.query(
        //   `SELECT id, first_name, last_name, email, phone, password_hash, is_user, team_id as team, org_id as organisation, is_admin, created_at, created_by, is_deleted FROM persons WHERE id = ${args.id};`
        // );
        // const single_person = query.rows[0];
        // return single_person;
        return;
      },
    },
  }),
});

const RootMutationType = new GraphQLObjectType({
  name: "Mutations",
  description: "Root Mutation",
  fields: () => ({
    // addBook: {
    //   type: BookType,
    //   description: "add a book",
    //   args: {
    //     name: { type: GraphQLNonNull(GraphQLString) },
    //     authorId: { type: GraphQLNonNull(GraphQLInt) },
    //   },
    //   resolve: (parent, args) => {
    //     const book = {
    //       id: books.length + 1,
    //       name: args.name,
    //       authorId: args.authorId,
    //     };
    //     books.push(book);
    //     return book;
    //   },
    // },
    // addAuthor: {
    //   type: AuthorType,
    //   description: "add an author",
    //   args: {
    //     name: { type: GraphQLNonNull(GraphQLString) },
    //   },
    //   resolve: (parent, args) => {
    //     const author = {
    //       id: authors.length + 1,
    //       name: args.name,
    //     };
    //     authors.push(author);
    //     return author;
    //   },
    // },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  // mutation: RootMutationType,
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
  console.log("Listening on port " + PORT);
});
