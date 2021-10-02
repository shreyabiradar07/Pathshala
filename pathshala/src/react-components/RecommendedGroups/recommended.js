import React,{useState,useEffect,useContext,useCallback} from 'react'
import Loading from './Loading'
import EventCard from "../EventCard/index";
const Recommended  = ()=>{
   const [data,setData]=useState()
   const [user, setUser]=useState('')
    const [loading,setLoading]=useState(true)
   const [userloaded,setUserLoaded]=useState(false)
    useEffect(()=>{
        if(!userloaded)
     {   const url = "/users/curruser";

        fetch(url)
            .then(res => {
                if (res.status === 200) {
                    console.log("read")
                    console.log(res);
                    return res.json();
                   
                }
            })
            .then(json => {
                if (json && json.currentUser) {
                    console.log(json.currentUser);
                    setUser(json.currentUser)
                    setUserLoaded(true)

                }
            })
            .catch(error => {
                console.log(error);
            });
        }
            if(user!==''&&userloaded){
                console.log(user);
       fetch('/recommendedGroups',{
           
           headers:{
               "Authorization":"Bearer "+localStorage.getItem("token"),
              "weaknesses": user.weaknesses
               
           },
           
       }).then(res=>res.json())
       .then(result=>{
           console.log(result.recommendedGroups);
          setData(result.recommendedGroups)
         
          setLoading(false);
     
    

       }
    )
    }}
    ,[userloaded])
    // const handleSubmit = (e) => {
    //   e.preventDefault();
      
    //   setState({...state,
    //     country : store.country,
    //     category : store.category,
    //     query: store.query
    //   })
    // }
    
    // const handleChange = (e) => {
    //   const name = e.target.name;
    //   const value = e.target.value;
    //   setStore({...store,[name]:value});
    // }
    const Main = () => {
      return (
        <>
         
            <div className="event-list">
          {data===null ? (
            <div className="empty-list-text">No events match the filter(s).</div>
          ) : (
            data.map(event => (
              <EventCard 
              username={user.username}
            
              event={event}
            />
            ))
          )}
        </div>
      
          </>
      )
    }
   return (
    <React.Fragment>
    {loading ? <Loading /> : <Main />}
  </React.Fragment>
   )

}


export default Recommended