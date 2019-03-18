import React, { Component } from 'react';
import {graphql,compose} from "react-apollo";
import {getAuthorsQuery,addBookMutation,getBooksQuery} from "../queries/queries";

class AddBook extends Component {
  constructor(props){
    super(props);
    this.state={
      bookname:"",
      genre:"",
      authorname:""
    }
  }
  displayAuthors(){
    let data = this.props.getAuthorsQuery;
    if(data.loading){
      return <option disabled>Loading Authors ...</option>
    }else{
      return data.authors.map(author=>{
        return <option key={author.id} value={author.id}>{author.authorname}</option>
      })
    }
  }
  submitForm(e){
    e.preventDefault();
    this.props.addBookMutation({
      variables:{
        bookname:this.state.bookname,
        genre:this.state.genre,
        authorname:this.state.authorname,
      },
      refetchQueries:[{query:getBooksQuery}]
    });
  }
  render() {
    return (
      <form id="add-book" onSubmit={this.submitForm.bind(this)}>
        <h2>添加新书</h2>
        <div className="field">
          <label>Book name:</label>
          <input type="text" onChange={(e)=>this.setState({bookname:e.target.value})}/>
        </div>
        <div className="field">
          <label>Genre:</label>
          <input type="text" onChange={(e)=>this.setState({genre:e.target.value})}/>
        </div>
        <div className="field">
          <label>Author name:</label>
          <input type="text" onChange={(e)=>this.setState({authorname:e.target.value})}/>
        </div>
        <button>+</button>
      </form>
    );
  }
}

export default compose(
  graphql(getAuthorsQuery, { name: "getAuthorsQuery" }),
  graphql(addBookMutation, { name: "addBookMutation" })
)(AddBook);