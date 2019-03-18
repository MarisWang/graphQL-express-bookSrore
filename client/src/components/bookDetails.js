import React, { Component } from 'react';
import {graphql} from "react-apollo";
import {getBookDetailQuery} from "../queries/queries";

class BookDetails extends Component {
  displayBookDetails(){
    let {book} = this.props.data;
    if(book){
      return <div>
        <h2>书名：{book.bookname}</h2>
        <p>类型：{book.genre}</p>
        <p>作者：{book.authorname.authorname}</p>
        <p>作者的其他作品</p>
        <ul className="other-books">
          {book.authorname.books.map(item=>{
            return <li key={item.id}>{item.bookname}</li>
          })}
        </ul>
      </div>
    }else{
      return <div>No book Selected...</div>
    }
  }
  render() {
    return (
      <div id="book-detail">
        {this.displayBookDetails()}
      </div>
    );
  }
}

export default graphql(getBookDetailQuery,{
  options:(props)=>{
    return {
      variables:{
        id:props.bookId
      }
    }
  }
})(BookDetails);