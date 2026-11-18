import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

interface ContactSectionProps {
  /** Portfolio slug — used for tracking / inquiry API calls, optional here */
  portfolioSlug?: string;
  fullName: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  location?: string;
  darkVariant?: boolean;
}

// Strip everything except digits and a leading "+"
const cleanPhone = (value: string) => value.replace(/[^\d+]/g, '');

// wa.me requires digits only (no +, no spaces, no dashes)
const cleanWhatsApp = (value: string) => value.replace(/\D/g, '');

export const ContactSection: React.FC<ContactSectionProps> = ({
  portfolioSlug, // accepted for API/tracking use — not needed for the links below
  fullName,
  email,
  phone,
  whatsapp,
  location,
  darkVariant = false,
}) => {
  // Reusable link styles
  const linkBase = `text-sm font-semibold hover:underline transition-colors break-all ${darkVariant
    ? 'text-white hover:text-corporate-lightBlue'
    : 'text-corporate-navy hover:text-corporate-blue'
    }`;

  const iconBoxBase = `w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${darkVariant
    ? 'bg-slate-800 text-corporate-lightBlue'
    : 'bg-corporate-secBg text-corporate-navy'
    }`;

  return (
    <div
      id="contact"
      className={`rounded-2xl p-6 sm:p-10 border transition-all ${darkVariant
        ? 'bg-corporate-deep text-white border-corporate-navy shadow-elevated'
        : 'bg-white text-corporate-text border-corporate-border shadow-subtle'
        }`}
    >
      {/* Single column, centered, max-width for readability on large screens */}
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Heading block */}
        <div>
          <span
            className={`text-xs font-bold uppercase tracking-wider ${darkVariant ? 'text-corporate-lightBlue' : 'text-corporate-blue'
              }`}
          >
            Get In Touch
          </span>
          <h3
            className={`text-2xl sm:text-3xl font-extrabold mt-1 tracking-tight ${darkVariant ? 'text-white' : 'text-corporate-navy'
              }`}
          >
            Connect with {fullName}
          </h3>
          <p
            className={`mt-2 text-sm leading-relaxed ${darkVariant ? 'text-slate-300' : 'text-corporate-mutedText'
              }`}
          >
            Interested in consulting, technical collaboration, or discussing
            strategic opportunities? Send a message directly.
          </p>
        </div>

        {/* Contact methods — stacked list */}
        <div className="space-y-4">
          {/* EMAIL — opens default mail app */}
          <a
            href={`mailto:${email}?subject=${encodeURIComponent(
              `Inquiry from portfolio — ${fullName}`
            )}`}
            className="flex items-center space-x-3 group min-w-0"
          >
            <div className={iconBoxBase}>
              <Mail className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-400">Direct Email</p>
              <span className={linkBase}>{email}</span>
            </div>
          </a>

          {/* PHONE — opens dial pad */}
          {phone && (
            <a
              href={`tel:${cleanPhone(phone)}`}
              className="flex items-center space-x-3 group min-w-0"
            >
              <div className={iconBoxBase}>
                <Phone className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-400">Call</p>
                <span className={linkBase}>{phone}</span>
              </div>
            </a>
          )}

          {/* WHATSAPP — opens WhatsApp chat */}
          {whatsapp && (
            <a
              href={`https://wa.me/${cleanWhatsApp(whatsapp)}?text=${encodeURIComponent(
                `Hi ${fullName}, I found your portfolio and would like to connect.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 group min-w-0"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${darkVariant
                  ? 'bg-slate-800 text-emerald-400'
                  : 'bg-emerald-50 text-emerald-600'
                  }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 0 5.463 0 12.045c0 2.124.555 4.195 1.61 6.02L0 24l6.105-1.594a11.99 11.99 0 0 0 5.94 1.578h.006c6.582 0 12.045-5.463 12.045-12.045 0-3.196-1.245-6.196-3.576-8.49zM12.05 21.9h-.005a9.94 9.94 0 0 1-5.066-1.386l-.363-.216-3.767.986 1.007-3.673-.237-.377a9.98 9.98 0 0 1-1.53-5.31c0-5.512 4.486-9.997 10-9.997 2.67 0 5.18 1.041 7.07 2.93a9.94 9.94 0 0 1 2.928 7.078c0 5.512-4.486 9.965-9.997 9.965z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-400">WhatsApp</p>
                <span className={linkBase}>Chat on WhatsApp</span>
              </div>
            </a>
          )}

          {/* LOCATION — opens Google Maps */}
          {location && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                location
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 group min-w-0"
            >
              <div className={iconBoxBase}>
                <MapPin className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-400">Location</p>
                <span className={linkBase}>{location}</span>
              </div>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};