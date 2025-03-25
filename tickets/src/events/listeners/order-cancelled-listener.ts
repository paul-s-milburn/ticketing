import { Listener, OrderCancelledEvent, Subjects } from "@psmtickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
 
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;
  
  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // find the ticket
    
    const ticket = await Ticket.findById(data.ticket.id); 

    // if no ticket, throw error
    if (!ticket) { 
      throw new Error('Ticket not found'); 
    }


    // mark ticket as not reseverd by deleting orderId
    ticket.set({orderId: undefined});

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
