import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import { TicketUpdatedEvent } from "@psmtickets/common";
import { TicketUpdatedListener } from "../ticket-updated-listener"; 
import { natsWrapper } from "../../../nats-wrapper";

const setup = async()=>{
  // create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);
  // create a fake ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10
  });
  await ticket.save();

  // fake data object
  const data: TicketUpdatedEvent['data'] = {
    version: 1,
    id: ticket.id,
    title: 'new concert',
    price: 100,
    userId: new mongoose.Types.ObjectId().toHexString()
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  } 

  // return stuff
  return { msg, data, ticket, listener};

}


it('finds, updates and saves a ticket', async()=>{
  const {msg, data, ticket, listener} = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async()=>{
  const {msg, data, listener} = await setup();
  // // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);
  // // write assertions to make sure a ticket was created!
  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if event has a skipped version number', async()=>{
  const {msg, data, ticket, listener} = await setup();

  data.version += 2;

  try {
  await listener.onMessage(data, msg);
  } catch (err) {

  }

  expect(msg.ack).not.toHaveBeenCalled();

})