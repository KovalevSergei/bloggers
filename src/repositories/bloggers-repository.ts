import { bloggers } from "./db";


export const bloggersRepository={
getBloggers(){
    return bloggers
},

getBloggersById(id:number){
    const blogger=bloggers.find(v => v.id===id)
    return blogger
},

deleteBloggersById(id:number){
    const index = bloggers.findIndex(v=>v.id===id)
    if (index===-1){
       return  false
      }else{
        bloggers.splice(index,1)
        return true
      }
      
},
createBloggers(name: string, youtubeUrl: string){
    const bloggersnew = {
        id: +(new Date()),
        name: name,
        youtubeUrl: youtubeUrl
    }
    
      bloggers.push(bloggersnew)
      return bloggersnew
      
},

updateBloggers(id: number, name: string, youtubeUrl: string){
    const bloggersnew=bloggers.find(v=> v.id===id);
    
    if(!bloggersnew){
        return false
    }else{
       bloggersnew.name=name
       bloggersnew.youtubeUrl=youtubeUrl
      
      return bloggersnew
}
},








}