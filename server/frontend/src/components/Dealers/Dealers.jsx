import React, { useState, useEffect } from 'react';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';
import review_icon from "../assets/reviewicon.png"

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);
  // let [state, setState] = useState("")
  let [states, setStates] = useState([])

  // let root_url = window.location.origin
  let dealer_url ="/djangoapp/get_dealers";
  
  let dealer_url_by_state = "/djangoapp/get_dealers/";
 
  const filterDealers = async (state) => {
    if (state === "All") {
      get_dealers();
      return;
    }
    
    try {
      const res = await fetch(dealer_url_by_state + state, {
        method: "GET"
      });
      const retobj = await res.json();
      if(retobj.status === 200) {
        let state_dealers = Array.from(retobj.dealers)
        setDealersList(state_dealers)
      } else {
        console.error('Error filtering dealers:', retobj.message);
      }
    } catch (error) {
      console.error('Error filtering dealers:', error);
    }
  }

  const get_dealers = async ()=>{
    try {
      const res = await fetch(dealer_url, {
        method: "GET"
      });
      const retobj = await res.json();
      if(retobj.status === 200) {
        let all_dealers = Array.from(retobj.dealers)
        let states = [];
        all_dealers.forEach((dealer)=>{
          states.push(dealer.state)
        });

        setStates(Array.from(new Set(states)))
        setDealersList(all_dealers)
      } else {
        console.error('Error fetching dealers:', retobj.message);
      }
    } catch (error) {
      console.error('Error fetching dealers:', error);
    }
  }
  useEffect(() => {
    get_dealers();
  },[]);  


let isLoggedIn = sessionStorage.getItem("username") != null ? true : false;
return(
  <div>
      <Header/>

     <table className='table'>
      <thead>
        <tr>
          <th>ID</th>
          <th>Dealer Name</th>
          <th>City</th>
          <th>Address</th>
          <th>Zip</th>
          <th>
          <select name="state" id="state" onChange={(e) => filterDealers(e.target.value)}>
          <option value="" disabled>State</option>
          <option value="All">All States</option>
          {states.map((state, index) => (
              <option key={index} value={state}>{state}</option>
          ))}
          </select>        

          </th>
          {isLoggedIn ? (
              <th>Review Dealer</th>
             ):<></>
          }
        </tr>
      </thead>
      <tbody>
     {dealersList.map((dealer, index) => (
        <tr key={index}>
          <td>{dealer['id']}</td>
          <td><a href={'/dealer/'+dealer['id']}>{dealer['full_name']}</a></td>
          <td>{dealer['city']}</td>
          <td>{dealer['address']}</td>
          <td>{dealer['zip']}</td>
          <td>{dealer['state']}</td>
          {isLoggedIn ? (
            <td><a href={`/postreview/${dealer['id']}`}><img src={review_icon} className="review_icon" alt="Post Review"/></a></td>
           ):<></>
          }
        </tr>
      ))}
      </tbody>
     </table>;
  </div>
)
}

export default Dealers
