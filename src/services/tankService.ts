import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, PutCommandOutput, UpdateCommand, UpdateCommandOutput, DeleteCommand, DeleteCommandOutput } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { Tank } from '../interfaces/tankInterface';
import EventService from './eventService';
import { TABLE } from '../constants/tableEnum';
import { RESPONSE_MESSAGE } from '../constants/responseMessageEnum';

const eventService = new EventService();

interface GetTankResponse {
  data: Tank | Tank[] | undefined,
  message: string
}
interface PutTankResponse {
  data: PutCommandOutput | undefined,
  message: string
}
interface UpdateTankResponse {
  data: UpdateCommandOutput | undefined,
  message: string
}

interface DeleteTankResponse {
  data: DeleteCommandOutput | undefined,
  message: string
}

class TankService {
  client: DynamoDBClient;
  docClient: DynamoDBDocumentClient;

  async getAllTanks(): Promise<GetTankResponse> {
    const command = new ScanCommand({
      "TableName": TABLE.TANK
    });

    try {
      const response = await this.docClient.send(command);

      if (response.Items?.length === 0) {
        return {
          data: undefined,
          message: RESPONSE_MESSAGE.NO_ITEMS_FOUND
        };
      }

      const tanks = response.Items as Tank[];

      return {
        data: tanks,
        message: RESPONSE_MESSAGE.NO_ERROR
      };
    } catch (e) {
      console.error(`failed to get tanks: ${e}`);
      return {
        data: undefined,
        message: RESPONSE_MESSAGE.INTERNAL
      };
    }
  }

  async getTankById(tank_id: string): Promise<GetTankResponse> {
    const command = new GetCommand({
      "TableName": TABLE.TANK,
      "Key": {
        "id": tank_id
      }
    });

    try {
      const response = await this.docClient.send(command);

      if (!response.Item) {
        return {
          data: undefined,
          message: RESPONSE_MESSAGE.NOT_FOUND
        };
      }

      const tank = response.Item as Tank;

      return {
        data: tank,
        message: RESPONSE_MESSAGE.NO_ERROR
      }
    } catch (e) {
      console.error(`failed to get tank with Id ${tank_id}`);
      return {
        data: undefined,
        message: RESPONSE_MESSAGE.INTERNAL
      }
    }
  }

  async createTank(tank: Tank): Promise<PutTankResponse> {
    const tank_id = uuidv4();
    tank.id = tank_id;

    const command = new PutCommand({
      "TableName": TABLE.TANK,
      "Item": tank
    });

    try {
      const response = await this.docClient.send(command);

      return {
        data: response,
        message: RESPONSE_MESSAGE.NO_ERROR
      }
    } catch (e) {
      console.error(`failed to create tank: ${e}`);

      return {
        data: undefined,
        message: RESPONSE_MESSAGE.INTERNAL
      }
    }
  }

  async putTank(tank: Tank): Promise<PutTankResponse> {
    const command = new PutCommand({
      "TableName": TABLE.TANK,
      "Item": tank
    });

    try {
      const exists = await this.checkTankExists(tank.id);
      const response = await this.docClient.send(command);

      if (!exists) {
        response.$metadata.httpStatusCode = 201;
        return {
          data: response,
          message: RESPONSE_MESSAGE.NOT_FOUND
        }
      }

      // Check if events occurred
      const tankPreviousStateResponse = await this.getTankById(tank.id);
      const tankPreviousState = tankPreviousStateResponse.data as Tank;

      await eventService.determineEventOccurred(tank, tankPreviousState);

      return {
        data: response,
        message: RESPONSE_MESSAGE.NO_ERROR
      }
    } catch (e) {
      console.error(`failed to update tank: ${e}`);

      return {
        data: undefined,
        message: RESPONSE_MESSAGE.INTERNAL
      }
    }
  }

  /*async updateTank(tank: Tank): Promise<UpdateTankResponse> {
    const command = new
  }*/

  async deleteTank(tank_id: string): Promise<DeleteTankResponse> {
    const command = new DeleteCommand({
      "TableName": TABLE.TANK,
      "Key": {
        "id": tank_id
      }
    });

    try {
      const response = await this.docClient.send(command);

      return {
        data: response,
        message: RESPONSE_MESSAGE.NO_ERROR
      }
    } catch (e) {
      console.error(`failed to delete tank with Id ${tank_id}: ${e}`);

      return {
        data: undefined,
        message: RESPONSE_MESSAGE.INTERNAL
      }
    }
  }

  async checkTankExists(tank_id: string): Promise<boolean> {
    const response = await this.getTankById(tank_id);
    const exists = response.message === RESPONSE_MESSAGE.NO_ERROR ? true : false;
    return exists;
  }

  constructor() {
    this.client = new DynamoDBClient({});
    this.docClient = DynamoDBDocumentClient.from(this.client);
  }
}

export default TankService;