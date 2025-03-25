import axios from "axios";

const BuildClient = ({req}) => {
  if (typeof window === 'undefined') {
    // on server
    console.log('Making API call on Server');
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers
    });
  } else {
    // on browser
    console.log('Making API call on Browser');
    return axios.create({
      baseURL: '/'
    });
  }

};

export default BuildClient