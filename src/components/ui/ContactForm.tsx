"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import Button from "./Button";
import { CONTACT_SUBJECTS } from "@/lib/constants";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: CONTACT_SUBJECTS[0],
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoSubject = encodeURIComponent(
      `Anfrage: ${formData.subject} — ${formData.name}`
    );
    const mailtoBody = encodeURIComponent(
      `Name: ${formData.name}\nE-Mail: ${formData.email}\nTelefon: ${formData.phone || "nicht angegeben"}\n\n${formData.message}`
    );
    window.location.href = `mailto:[wird ergänzt]?subject=${mailtoSubject}&body=${mailtoBody}`;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl p-8 md:p-10 border border-brown/12 text-center">
        <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send className="w-7 h-7 text-forest" />
        </div>
        <h3 className="text-2xl mb-2">Vielen Dank!</h3>
        <p className="text-text-secondary">
          Ihr E-Mail-Programm sollte sich geöffnet haben. Falls nicht, schreiben
          Sie uns bitte direkt eine E-Mail.
        </p>
        <button
          className="mt-6 text-forest underline underline-offset-4 hover:text-forest-dark transition-colors cursor-pointer"
          onClick={() => setSubmitted(false)}
        >
          Neue Nachricht schreiben
        </button>
      </div>
    );
  }

  const inputClasses =
    "w-full px-4 py-3 rounded-xl border border-beige-dark bg-cream/50 text-text placeholder:text-text-light focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all duration-200";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-semibold mb-1.5">
          Name *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="Ihr Name"
          className={inputClasses}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold mb-1.5">
            E-Mail *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="ihre@email.de"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold mb-1.5">
            Telefon
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Optional"
            className={inputClasses}
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-semibold mb-1.5">
          Betreff *
        </label>
        <select
          id="subject"
          name="subject"
          required
          value={formData.subject}
          onChange={handleChange}
          className={inputClasses}
        >
          {CONTACT_SUBJECTS.map((subject) => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold mb-1.5">
          Nachricht *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={handleChange}
          placeholder="Ihre Nachricht an uns..."
          className={`${inputClasses} resize-y`}
        />
      </div>

      <Button type="submit" variant="primary" size="lg" className="w-full">
        <Send className="w-4 h-4 mr-2" />
        Nachricht senden
      </Button>
    </form>
  );
}
