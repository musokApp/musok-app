import Link from 'next/link';
import { ShamanProfile } from '@/types/shaman.types';
import { MapPin, Star } from 'lucide-react';

interface ShamanCardProps {
  shaman: ShamanProfile;
}

export function ShamanCard({ shaman }: ShamanCardProps) {
  return (
    <Link
      href={`/shamans/${shaman.id}`}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-100">
        {shaman.images[0] ? (
          <img
            src={shaman.images[0]}
            alt={shaman.businessName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-50 to-indigo-50">
            <span className="text-5xl">🔮</span>
          </div>
        )}

        {/* Experience Badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-primary">
          경력 {shaman.yearsExperience}년
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-gray-900 text-lg">{shaman.businessName}</h3>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-gray-900">{shaman.averageRating.toFixed(1)}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
          <MapPin className="w-3.5 h-3.5" />
          <span>{shaman.region} {shaman.district}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {shaman.specialties.map((specialty) => (
            <span
              key={specialty}
              className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full"
            >
              {specialty}
            </span>
          ))}
        </div>

        {shaman.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{shaman.description}</p>
        )}

        <div className="flex items-baseline gap-1 pt-3 border-t border-gray-100">
          <span className="text-xl font-bold text-gray-900">
            {shaman.basePrice.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500">원~</span>
        </div>
      </div>
    </Link>
  );
}
