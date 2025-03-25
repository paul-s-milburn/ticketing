import { OrderCreatedEvent, OrderStatus } from "@psmtickets/common";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"
import mongoose from "mongoose";

const setup = async() => {
  // create listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // create ticket
  const ticket = Ticket.build({
    title:'concert',
    price: 99,
    userId: 'asdf'
  });
  await ticket.save();

  // create fake data event
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: "blah",
    expiresAt: "blah",
    ticket: {
      id: ticket.id,
      price:ticket.price
    }
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };
  
  return { listener, ticket, data, msg };

};

it('sets userId of the ticket', async()=>{
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async()=>{
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async()=>{
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();


  const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

  expect(data.id).toEqual(ticketUpdatedData.orderId);
});

it('', async()=>{
  
});
