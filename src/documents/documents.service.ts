import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Act, ActDocument } from '../send-pdf/send-pdf.schema';
import { Model, Types } from 'mongoose';
import { GetDocumentByDateDto } from './dto/get-document-by-date.dto';

@Injectable()
export class DocumentsService {
    constructor(
        @InjectModel(Act.name)
        private actRepository: Model<ActDocument>
    ) {}

    async getTodayDocuments(userId: Types.ObjectId) {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        return await this.actRepository
            .find({
                user: userId,
                createdAt: { $gte: startOfToday, $lte: endOfToday },
            })
            .sort({ createdAt: -1 })
            .populate('user', 'username')
            .exec();
    }

    async getDocuments(
        { formatStartDate, formatEndDate }: GetDocumentByDateDto,
        userId: Types.ObjectId
    ) {
        const startOfDay = new Date(`${formatStartDate}T00:00:00.000Z`);
        const endOfDay = new Date(`${formatEndDate}T23:59:59.999Z`);

        return await this.actRepository
            .find({
                user: userId,
                createdAt: { $gte: startOfDay, $lte: endOfDay },
            })
            .sort({ createdAt: -1 })
            .populate('user', 'username')
            .exec();
    }
}
