import { useEffect, useState } from "react";
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import { useRouter } from "next/navigation";



const OrderShow = ({ order, currentUser }) => {
  const router = useRouter();  
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      OrderId: order.id 
    },
    onSuccess: () => router.push('/orders')
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft/1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);
  
    return () => {
      clearInterval(timerId);
    }
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }


  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={({ id }) => doRequest({ token: id }) }
        stripeKey="pk_test_51R3h8zFd9usKxKVxe1WZfAtkfqlNhMQz61lDbDTwDJqPfnmDCtb1XkPRe97924T6J9852BOiHQNC1DMWID7g29rW00qrzRPOwb"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );  

};

OrderShow.getInitialProps = async (context, client ) => {
  const {orderid} = context.query;
  const { data } = await client.get(`/api/orders/${orderid}`);

  return { order: data };
}


export default OrderShow;
