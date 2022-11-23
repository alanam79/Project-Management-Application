const { projects, clients } = require("../sampleData.js");

// mongoose models
const Project = require("../models/Project");
const Client = require("../models/Client");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
} = require("graphql");

// project type
const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      type: ClientType,
      resolve(parent, args) {
        // belowreturn the client id when it matches the project (or parent) clientid
        // return clients.find((client) => client.id === parent.clientId); <- using sample data
        return Client.findById(parent.clientId);
      },
    },
  }),
});

// client type
const ClientType = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

// ROOT QUERY OBJECT
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    // get all projects
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        // return projects; <- using sample data
        return Project.find(); // using mongoose model
      },
    },
    // get one project
    project: {
      type: ProjectType,
      //   arguments
      args: { id: { type: GraphQLID } },
      // response obtained by using resolver
      resolve(parent, args) {
        // return projects.find((project) => project.id === args.id); <- using sample data
        return Project.findById(args.id); // using mongoose model and args from above
      },
    },
    // get all clients
    clients: {
      type: new GraphQLList(ClientType),
      resolve(parent, args) {
        // return clients; <- using sample data
        return Client.find();
      },
    },
    // get one client
    client: {
      type: ClientType,
      //   arguments
      args: { id: { type: GraphQLID } },
      // response obtained by using resolver
      resolve(parent, args) {
        // return clients.find((client) => client.id === args.id); <- using sample data
        return Client.findById(args.id); // using mongoose model and args from above
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
