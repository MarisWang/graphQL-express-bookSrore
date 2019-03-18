import React, { Component } from 'react';
import {graphql} from "react-apollo";
import {getBooksQuery} from "../queries/queries";
import BookDetails from "./bookDetails";

class BookList extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedId:null
    }
  }
  displayBooks(){
    let {books} = this.props.data;
    if(this.props.data.loading){
      return <div>Loading Books ...</div>
    }else{
      return books.map(book=>{
        return <li key={book.id} onClick={(e)=>{this.setState({selectedId:book.id})}}>{book.bookname}</li>
      })
    }
  }
  render() {
    return (
      <div>
        <ul id="book-list">
          {this.displayBooks()}
        </ul>
        <BookDetails bookId={this.state.selectedId}/>
      </div>
    );
  }
}

export default graphql(getBooksQuery)(BookList);
