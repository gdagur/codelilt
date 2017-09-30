var DBBox = React.createClass({
  queryArticlesFromServer: function(data) {
  $.ajax({
    url: this.props.url,
    dataType: 'json',
    data: {username:data.username,isPublished:data.isPublished, heading:data.heading},
    cache: false,
    success: function(data) {
      this.setState({data: data});
      this.setState({details: {}});
    }.bind(this),
    error: function(xhr, status, err) {
      console.error(this.props.url, status, err.toString());
    }.bind(this)
  });
},
getInitialState: function() {
  return {data: [], details:{}, relatedArticles:{}};
},
componentDidMount: function() {
  //uncomment this if want to load articles on page load
  //  this.queryArticlesFromServer();
},
updateArticleDetails: function(url){
  $.ajax({
    url: this.props.realtedUrl,
    dataType: 'json',
    data:{url:url},
    cache: false,
    success: function(data) {
       var result  = this.state.data.filter(function(o){return o.url == url;} );
        result =  result? result[0] : null; // or undefined
        result['relatedArticles'] = data;
        this.setState({details:result});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
},
render: function() {
  return (
    <div className="DBBox col-md-12">
    <ArticleList updateArticleDetails={this.updateArticleDetails} data={this.state.data} />
    <ArticleDetails queryArticlesFromServer={this.queryArticlesFromServer} articleDetails={this.state.details} />
    </div>
    );
}
});

var ArticleList = React.createClass({
  updateArticleDetails: function(url) {
    this.props.updateArticleDetails(url);
  },
  render: function() {
    var updateArticleDetails = this.updateArticleDetails;
    var commentNodes = this.props.data.map(function(article) {
      return (
        <Article updateArticleDetails={updateArticleDetails} url={article.url} heading={article.heading} key={article._id}>
        </Article>
        );
    });
    return (
      <div className="commentList col-md-4">
      <h4>Articles</h4>
      {commentNodes}
      </div>
      );
  }
});

var Article = React.createClass({
  updateArticleDetails : function() {
    this.props.updateArticleDetails(this.props.url);
  },

  render: function() {
    return (
      <div className="comment">
      <a onClick={this.updateArticleDetails} className="articleheading handpointer">
      {this.props.heading}
      </a>
    {/*<span dangerouslySetInnerHTML={this.rawMarkup()} />*/}
    </div>
    );
  }
});

var ArticleDetails = React.createClass({
  getInitialState: function() {
    return {articleId:'', username: '', heading: '', isPublished:'true', relatedArticles:{}, allArticles:[], tags:[], message:''};
  },
  userUpdate: function(e) {
    this.setState({username: e.target.value});
  },
  publishUpdate: function(e) {
    this.setState({isPublished: e.target.value});
  },
  headingUpdate: function(e) {
    this.setState({heading: e.target.value});
  },
  addTag: function(tag){
    let arrTags = this.state.tags;
    arrTags.push(tag);
    this.setState({tags:arrTags})
  },
  updateArticle: function() {
    $.ajax({
      url: "/dbadminupdate",
      method:"post",
      dataType: 'text',
      data: {data: JSON.stringify(this.state)},
      cache: false,
      success: function(data) {
        this.setState({message:data});

      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCheckbox: function(data, type){
    if(type=='rl'){
      this.setState({relatedArticles:data});
    }

  },
  componentWillReceiveProps: function(nextProps) {
    var related = null;
    var all = null;
    var rl =nextProps.articleDetails.relatedArticles;
    
    if(rl){
      related = rl.related;
      all = rl.all;
    }
    this.setState({
      heading: nextProps.articleDetails.heading||'',
      username: nextProps.articleDetails.username||'',
      isPublished:nextProps.articleDetails.isPublished||'true',
      tags:nextProps.articleDetails.tags||'',
      relatedArticles:related||{},
      allArticles:all||[],
      articleId:nextProps.articleDetails._id,
      message:''
    });
}, 
queryArticlesFromServer: function(e) {
  this.setState({message:''});
  this.props.queryArticlesFromServer(this.state);
},
render: function() {
  return (
    <div>
    <div className="col-md-4 admin_inputs">

    <Tag data={this.state.tags} addTag={this.addTag} />
    <br />
    <div className="row">
    <div className="col-md-3">
    Username :
    </div>
    <div className="col-md-9">    
    <input
    type="text"
    placeholder="Your name"
    value={this.state.username||''}
    onChange={this.userUpdate}
    />
    </div>
    </div>
    <br />
    <div className="row">
    <div className="col-md-3">
    isPublished 
    </div>
    <div className="col-md-9">
    <select value={this.state.isPublished} onChange={this.publishUpdate}>
    <option value="false">false</option>
    <option value="true">true</option>
    </select>
    </div>
    </div>
    <br />
    <div className="row">
    <div className="col-md-3">
    Heading 
    </div>
    <div className="col-md-9">
    <input className="full-width"
    type="text"
    placeholder="Heading..."
    value={this.state.heading||''}
    onChange={this.headingUpdate}
    /> 
    </div>
    </div>
    <br />
    <div className="row">
    <div className="col-md-2"></div>
    <div className="col-md-2">
    <input type="button" onClick={this.updateArticle} value="Update" />
    </div>
    <div className="col-md-2">
    <input type="button" onClick={this.queryArticlesFromServer} value="Query" />
    </div>
    </div>
    {this.state.message}
    </div>

    <div className="col-md-3">
    <h4>Select Related Articles</h4>
    <CheckboxSeclect relatedArticles={this.state.relatedArticles} allArticles={this.state.allArticles} handleCheckbox={this.handleCheckbox} type="rl"/>
    </div>
    </div>
    );
}
});

var CheckboxSeclect = React.createClass({
  handleCheckbox: function(checked, e){
    let temp = this.props.relatedArticles;
    if(jQuery.isEmptyObject(temp)){
      temp = {relatedArticles:[],relatedTitles:[]}
    }
    if(checked){
     temp.relatedTitles.push(e.split(";")[0]);
     temp.relatedArticles.push(e.split(";")[1]);
   }
   else{
    let v = e.split(";")[0].trim();
    var rl = temp.relatedTitles;
    let index =-1;
    for(var i=0;i<rl.length;i++){
      if(rl[i]==v){
        index = i;
      }
    }
    if(index!=-1){
     rl.splice(index,1);
   }
   var ra = temp.relatedArticles;
   index =-1;
   v = e.split(";")[1].trim();
   for(var i=0;i<rl.length;i++){
    if(ra[i]==v){
      index = i;
    }
  }
  if(index!=-1){
   ra.splice(index,1);
 }
}
this.props.handleCheckbox(temp, this.props.type);

},
componentWillReceiveProps: function(nextProps) {
  var checkboxes=[];
  if(nextProps.allArticles){
    var ra = nextProps.relatedArticles;
    var handleCheckbox = this.handleCheckbox;
    checkboxes = nextProps.allArticles.map(function(article) {
      if(ra && ra.relatedTitles && ra.relatedTitles.indexOf(article.heading)>=0){
        let temp = article.heading+";"+article.url;
        return (
          <span key={article._id}>
          <label>
          <Checkbox handleCheckbox={handleCheckbox} value={temp} isChecked={true}/>
          {article.heading}</label><br/></span>
          );
      }else{
        let temp = article.heading+";"+article.url;
        return (
          <span key={article._id}>
          <label>
          <Checkbox handleCheckbox={handleCheckbox} value={temp} isChecked={false} />
          {article.heading}</label><br/></span>
          );
      }
    });
  }
  this.setState({checkboxes:checkboxes});
},
getInitialState: function() {
  return {checkboxes:[]};
},
render: function() {
  return (
    <div>
    {this.state.checkboxes}
    </div>
    );
}
});


var Checkbox = React.createClass({
  handleCheckbox: function(e){
    this.props.handleCheckbox(e.target.checked, e.target.value);
    this.setState({isChecked: !this.state.isChecked})
  },
  getInitialState: function() {
    return {isChecked:this.props.isChecked};
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({isChecked:nextProps.isChecked})
  },
  render: function() {
    return(
      <input type="checkbox" onChange={this.handleCheckbox} value={this.props.value} checked={this.state.isChecked} />
      );
  }

});

var Tag = React.createClass({
 getInitialState: function() {
  return {tag:''};
},
addTag: function(e) {
  {this.props.addTag(this.state.tag)}
},
updateTag: function(e) {
  this.setState({tag: e.target.value});
},
rawMarkup: function() {
  var md = new Remarkable();
  var rawMarkup = md.render(this.props.data.toString());
  return { __html: rawMarkup };
},
render: function() {
  return (
    <div className="row">
    <div className="col-md-3">
    Article Tags: 
    </div>
    <div className="col-md-9">
    <span dangerouslySetInnerHTML={this.rawMarkup()} /> 
    <input
    type="text"
    placeholder="Add new tag..."
    value={this.state.tag}
    onChange={this.updateTag}
    />
    <input type="button" onClick={this.addTag} value="Add Tag" /> 
    </div>
    </div>
    );
}
});

  ReactDOM.render(
    <DBBox url="/getdbarticle" realtedUrl="getdbrelated" />,
    document.getElementById('dbBox')
    );
