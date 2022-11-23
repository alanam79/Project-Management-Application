// const { projects, clients } = require("../sampleData.js");

// mongoose models
const Project = require("../models/Project");
const Client = require("../models/Client");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
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

// mutations
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    // add client
    addClient: {
      type: ClientType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const client = new Client({
          name: args.name,
          email: args.email,
          phone: args.phone,
        });

        return client.save();
      },
    },
    // delete client
    deleteClient: {
      type: ClientType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Client.findByIdAndRemove(args.id);
      },
    },

    // add a project
    addProject: {
      type: ProjectType,
      args: {
        name: { type: GraphQLNonNull(GraphQLID) },
        description: { type: GraphQLNonNull(GraphQLID) },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatus",
            values: {
              new: { value: "Not Started" },
              progress: { value: "In Progress" },
              completed: { value: "Completed" },
            },
          }),
          defaultValue: "Not Started",
        },
        clientId: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        const project = new Project({
          name: args.name,
          description: args.description,
          status: args.status,
          clientId: args.clientId,
        });
        return project.save();
      },
    },

    // delete a project
    deleteProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Project.findByIdAndRemove(args.id);
      },
    },

    // update a project
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatusUpdate",
            values: {
              new: { value: "Not Started" },
              progress: { value: "In Progress" },
              completed: { value: "Completed" },
            },
          }),
        },
      },
      resolve(parent, args) {
        return Project.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              description: args.description,
              status: args.status,
            },
          },
          { new: true }
        );
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
