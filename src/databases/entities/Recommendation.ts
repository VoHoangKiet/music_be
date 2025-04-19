import mongoose, { Document, Schema } from 'mongoose';

export interface IRecommendation extends Document {
  user: mongoose.Types.ObjectId;
  songs: mongoose.Types.ObjectId[];
  recommendDate: Date;
}

const recommendationSchema: Schema<IRecommendation> = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: true }],
  recommendDate: { type: Date, default: Date.now },
});

const Recommendation = mongoose.model<IRecommendation>(
  'Recommendation',
  recommendationSchema
);

export default Recommendation;
