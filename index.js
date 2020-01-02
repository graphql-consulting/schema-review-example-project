const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
    author: String
  }
  type Query {
    books: [Book!]
  }
  input UpdateBookTitleInput {
      id: ID!
      title: String!
  }
  type UpdateBookTitleResponse {
      message: String
      success: Boolean!
      book: Book
  }
  type BooksMutation {
      updateBookTitle(input: UpdateBookTitleInput!): UpdateBookTitleResponse
  }
  type Mutation {
      books: BooksMutation 
  } 
`;

const books = [
    {
        id: '1',
        title: 'Harry Potter and the Chamber of Secrets',
        author: 'J.K. Rowling',
    },
    {
        id: '2',
        title: 'Jurassic Park',
        author: 'Michael Crichton',
    },
];

const resolvers = {
    Query: {
        books: () => books,
    },
    Mutation: {
        books: () => {
            return "dummy";
        }
    },
    BooksMutation: {
        updateBookTitle: (parent, args, context, info) => {
            const { id, title: newTitle } = args.input;
            const bookToUpdate = books.find(book => book.id == id);
            if (bookToUpdate) {
                bookToUpdate.title = newTitle;
                return {
                    success: true,
                    message: "Successfully updated book title",
                    book: bookToUpdate
                };
            } else {
                return {
                    success: false,
                    message: "Book to update not found"
                };
            }
        }
    },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
