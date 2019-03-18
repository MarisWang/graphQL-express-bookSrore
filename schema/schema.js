const graphql = require("graphql");
const Book = require("../models/book");
const Author = require("../models/author");
const {GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList,GraphQLNonNull} = graphql;


// {
//   books{ id bookname genre
//     author{
//       authorname
//     }
//   }
// }

// {book(id:"5c8b3e404f494d32a0cad175"){
//   bookname id genre authorname {
//      id authorname age
//      }
//   }
// }

//{  authors{authorname age id books{
//      id bookname genre
//      }
//   }
// }

// mutation{
//   addBook(bookname:"阴间神探",genre:"探案",authorname:"道门老九"){
//     bookname
//     genre
//   }
// }

// mutation{
//   addAuthor(authorname:"道门老九",age: 68){
//     authorname
//     age
//   }
// }

// {
//   author(id:"5c8b3d5ec75a0619ac67e2b3"){
//       authorname id age books{
//         bookname
//         genre
//       }
//   }
// }

const BookType = new GraphQLObjectType({
  name: "BookType",
  fields: () => ({
    id: {type: GraphQLID},
    bookname: {type: GraphQLString},
    genre: {type: GraphQLString},
    authorname: {
      type: AuthorType,
      resolve:async (parent, args)=> {
        let author = await Author.find({authorname:parent.authorname});
        return author[0]
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: "AuthorType",
  fields: () => ({
    id: {type: GraphQLID},
    authorname: {type: GraphQLString},
    age: {type: GraphQLInt},
    books: {
      type: new GraphQLList(BookType),
      resolve:async (parent, args)=> {
        let books = await Book.find({authorname:parent.authorname});
        return books;
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    book: {
      type: BookType,
      args: {id: {type: GraphQLID}},
      resolve:async (parent, args)=>{
        //code to get data from db or other source
        return Book.findById(args.id);
      }
    },
    author: {
      type: AuthorType,
      args: {id: {type: GraphQLID}},
      resolve:async (parent, args)=> {
        return Author.findById(args.id);
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({})
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return Author.find({})
      }
    }
  }
});


const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        authorname: {type:new GraphQLNonNull(GraphQLString)},
        age: {type: new GraphQLNonNull(GraphQLInt)},
      },
      resolve:async (parent, args) =>{
        let auther = await Author.findOne({"authorname":args["authorname"]}).exec();
        if(!auther){
          let author = new Author({
            authorname: args.authorname,
            age: args.age
          });
          return author.save();
        }
      }
    },
    /**GraphQLNonNull 这个属性是要求填的，不能没有，但是可以为空**/
    addBook: {
      type: BookType,
      args: {
        "bookname": {type: new GraphQLNonNull(GraphQLString)},
        "genre": {type:new GraphQLNonNull(GraphQLString)},
        "authorname": {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve:async (parent, args)=> {
        let auther = await Author.findOne({"authorname":args["authorname"]});
        let book = await Book.findOne({"bookname":args["bookname"]});
        /**作者不存在，书也不存在**/
        if(!auther && !book){
          let addauthor = new Author({
                "authorname": args["authorname"],
                 age:35,
              });
          let book = new Book({
            "bookname": args.bookname,
            "genre": args.genre,
            "authorname": args["authorname"]
          });
          await addauthor.save();
          return book.save();
        }else if(auther && !book){
          let book = new Book({
            "bookname": args.bookname,
            "genre": args.genre,
            "authorname": args["authorname"]
          });
          return book.save();
        }else {
          return "作者和书都存在";
        }
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});