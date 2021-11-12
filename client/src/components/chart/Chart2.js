import React, { useEffect, useState } from 'react';
import { API_ENCODED_KEY, getCovid19NatInfStateJson_URL,chanbi_key,yeongin_key } from '../Config';
import { Card, CardBody, CardHeader} from 'reactstrap';
import { getColor } from 'utils/colors';
import { Line} from 'react-chartjs-2';
import axios from 'axios';
import Loading from '../map/Loading';

const Chart2 = () => {
    const[Load,setLoad] = useState(true);
   const [ConfirmedData,setConfirmedData] = useState({});

  useEffect(() => {
        window.scrollTo(0, 0);
        let endpointInfo = `${getCovid19NatInfStateJson_URL}?serviceKey=${yeongin_key}&startCreateDt=20210501`; 

        const fetchEvents = async() =>{
            const res = await axios.get(endpointInfo);
            makeData(res.data.response.body.items.item);
            setLoad(false);
        }

        const makeData = (items) =>{
            const arr = items.reduce((acc,cur)=>{
                const currentDate = new Date(cur.createDt);
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                const date = currentDate.getDate();
                const natDefCnt = cur.natDefCnt;
                const nationNm = "South Korea";
                const findItem = acc.find(a=>a.year ===year&&a.month ===month&&a.nationNm===nationNm);
                 
            if(!findItem){
                acc.push({year,month,natDefCnt,nationNm})
            }

            if(findItem){
                findItem.nationNm = nationNm;
                findItem.natDefCnt = natDefCnt;
                findItem.date = date;
                findItem.year = year;
                findItem.month = month;
            }
            return acc;
        },[])

        const arrReverse = [...arr].reverse();
        const labels = arrReverse.map(a=>`${a.month+1}월`);
        setConfirmedData ({
                labels,
                datasets:[
                    {
                        label: '국내 누적 확진자',
                        backgroundColor: getColor('primary'),
                        borderColor: getColor('primary'),
                        borderWidth: 1,
                        fill:false,
                        data: arrReverse.map(a=>a.natDefCnt),
                    },
                ]
        });
    }    
        fetchEvents()
    })

    return (
        <Card>
            <CardHeader>국내 누적 확진자</CardHeader>
            <CardBody>
              {Load === true ? (
                <Loading/>
                ) : (
            <Line data={ConfirmedData} />
            )}
            </CardBody>
          </Card>
     );
}
 
export default Chart2;