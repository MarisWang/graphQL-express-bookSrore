import {gql} from "apollo-boost";

const getBooksQuery = gql`
  { books { 
      bookname id 
    }
  }
`;

const getAuthorsQuery = gql`
  { authors { 
        authorname id
      }
   }
`;

const addBookMutation = gql`
    mutation addBook($bookname: String!, $genre: String!, $authorname: String!){
        addBook(bookname: $bookname, genre: $genre, authorname: $authorname){
            bookname
            id
        }
    }
`;

const getBookDetailQuery = gql`
  query getBook($id: ID){
        book(id: $id) {
            id
            bookname
            genre
            authorname{
                id
                authorname
                age
                books {
                    bookname
                    id
                }
            }
        }
    }
`;

export {getAuthorsQuery,getBooksQuery,addBookMutation,getBookDetailQuery}