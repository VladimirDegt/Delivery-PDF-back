import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Act, ActDocument } from '../send-pdf/send-pdf.schema';
import { Model } from 'mongoose';

@Injectable()
export class DocumentsService {
    constructor(
        @InjectModel(Act.name)
        private actRepository: Model<ActDocument>
    ) {}

    async getTodayDocuments() {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        return await this.actRepository
            .find({
                createdAt: { $gte: startOfToday, $lte: endOfToday },
            })
            .sort({ createdAt: -1 })
            .exec();
    }

    async getDocuments(date: string) {
        const startOfDay = new Date(`${date}T00:00:00.000Z`);
        const endOfDay = new Date(`${date}T23:59:59.999Z`);

        return await this.actRepository
            .find({
                createdAt: { $gte: startOfDay, $lte: endOfDay },
            })
            .sort({ createdAt: -1 })
            .exec();
    }
}
