import Link from 'next/link';
import { ShamanProfile } from '@/types/shaman.types';
import { MapPin, Star, Sparkles } from 'lucide-react';

interface ShamanCardProps {
  shaman: ShamanProfile;
}

export function ShamanCard({ shaman }: ShamanCardProps) {
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 image-full">
      <figure className="relative h-64">
        {shaman.images[0] ? (
          <img
            src={shaman.images[0]}
            alt={shaman.businessName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent">
            <div className="text-8xl animate-bounce">🔮</div>
          </div>
        )}
      </figure>

      <div className="card-body">
        <div className="flex justify-between items-start mb-3">
          <div className="badge badge-primary badge-lg gap-1">
            <Sparkles className="w-3 h-3" />
            {shaman.yearsExperience}년
          </div>
          <div className="badge badge-secondary badge-lg gap-1">
            <Star className="w-3 h-3 fill-current" />
            {shaman.averageRating.toFixed(1)}
          </div>
        </div>

        <h2 className="card-title text-2xl mb-2">
          {shaman.businessName}
          <div className="badge badge-accent">NEW</div>
        </h2>

        <div className="flex items-center gap-2 text-sm opacity-80 mb-3">
          <MapPin className="w-4 h-4" />
          <span>{shaman.region} {shaman.district}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {shaman.specialties.map((specialty) => (
            <div key={specialty} className="badge badge-outline badge-primary">
              {specialty}
            </div>
          ))}
        </div>

        <p className="line-clamp-2 opacity-90 mb-4 text-sm">
          {shaman.description}
        </p>

        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-3xl font-bold text-primary">
            {shaman.basePrice.toLocaleString()}
          </span>
          <span className="text-lg">원~</span>
        </div>

        <div className="card-actions justify-end">
          <Link href={`/shamans/${shaman.id}`} className="btn btn-primary btn-block">
            <Sparkles className="w-4 h-4" />
            상세보기
          </Link>
        </div>
      </div>
    </div>
  );
}
