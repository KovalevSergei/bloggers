import { bloggers } from "./db";
import { posts } from "./db";

export const postsRepository={
    getPosts(){
        return posts
    },


    getpostsId(id:number){
    const postsid=posts.find(v => v.id===id)
    return postsid
},

updatePostsId(id: number, title: string, shortDescription:string, content:string, bloggerId:number){
    const postsnew =posts.find(v => v.id === id)
   if (!postsnew){
    return false
    
  
   }else{
    postsnew.title = title
    postsnew.shortDescription=shortDescription
    postsnew.content=content
    postsnew.bloggerId=bloggerId
    return true
   
   }
  
},
createPosts( title: string, shortDescription:string, content:string, bloggerId:number){

    const nameblog=bloggers.find(v =>+ v.id=== +bloggerId)
    console.log(bloggerId,bloggers.map(v=> v.id),nameblog)
    if (nameblog){
    const postnew={
      id: +(new Date()),
      title: title,
      shortDescription: shortDescription,
      content: content,
      bloggerId: bloggerId,
      bloggerName: nameblog.name
    }
    posts.push(postnew)
    return true
   
  }else{
    return false
   

  }

    
},

deletePosts(id:number){


    const isdelete = posts.findIndex(v=>v.id===id)
    if (isdelete===-1){
       return  false
      }else{
        posts.splice(isdelete,1)
        return true
      }
}












}