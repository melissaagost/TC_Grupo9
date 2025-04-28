import { Test, TestingModule } from '@nestjs/testing';
import { MesaController } from './mesa.controller';

describe('MesaController', () => {
  let controller: MesaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MesaController],
    }).compile();

    controller = module.get<MesaController>(MesaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
