import { Listener, OrderCreatedEvent, Subjects } from "@psmtickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
 
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // find the ticket
    
    const ticket = await Ticket.findById(data.ticket.id); 

    // if no ticket, throw error
    if (!ticket) { 
      throw new Error('Ticket not found'); 
    }


    // mark ticket as reseverd by setting orderid
    ticket.set({orderId: data.id});

    // save
    await ticket.save();

    await new TicketUpdatedPublisher(this.client)
    .publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId
    });


    // ack
    msg.ack();

  };
  
  
};
