import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { AppService } from './app.service';
import { MessageType } from './interfaces/message-type.enum';
import { IMessage } from './interfaces/messge.interface';
import { INews } from './interfaces/news.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'kafkaNodeProducer',
        brokers: ['ec2-13-229-128-200.ap-southeast-1.compute.amazonaws.com:9092'],
      },
      consumer: {
        groupId: 'hot-news-consumer' // Should be the same thing we give in consumer
      }
    }
  })
  client: ClientKafka;

  async onModuleInit() {
    // Need to subscribe to topic 
    // so that we can get the response from kafka microservice
    this.client.subscribeToResponseOf('hot-news');
    await this.client.connect();
  }

  @Post("/publish")
  getHello(@Body() news: INews) {

    // const news: INews = {
    //   title: "Title 1",
    //   briefDescription: "Helloe w2",
    //   imageUrl: "https://i1-vnexpress.vnecdn.net/2022/07/26/saigonthieunuoc-1658765758-8336-1658769497.jpg?w=680&h=408&q=100&dpr=1&fit=crop&s=qUc9VKLR7rogdUjLAZZ0Cw",
    //   destinationUrl: "https://vnexpress.net/noi-lo-thieu-nuoc-cua-sai-gon-4491856.html",
    // }

    const msg: IMessage = {
      type: MessageType.CREATE_NEWS,
      msg: news
    }

    console.log("message ", msg);

    return this.client.send('hot-news', msg); // args - topic, message
  }

  // @Delete("/news/delete/:id")
  // deleteNews(@Param("id") id: string) {

  //   // const news: INews = {
  //   //   title: "Title 1",
  //   //   briefDescription: "Helloe w2",
  //   //   imageUrl: "https://i1-vnexpress.vnecdn.net/2022/07/26/saigonthieunuoc-1658765758-8336-1658769497.jpg?w=680&h=408&q=100&dpr=1&fit=crop&s=qUc9VKLR7rogdUjLAZZ0Cw",
  //   //   destinationUrl: "https://vnexpress.net/noi-lo-thieu-nuoc-cua-sai-gon-4491856.html",
  //   // }

  //   const msg: IMessage = {
  //     type: MessageType.DELETE_NEWS,
  //     msg: {}
  //   }

  //   console.log("message ", msg);

  //   return this.client.send('hot-news', msg); // args - topic, message
  // }

}
