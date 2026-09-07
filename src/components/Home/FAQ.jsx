import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './FAQ.css';

const faqs = [
  {
    question: "Do you sell live or slaughtered chickens?",
    answer: "We offer both! You can order live birds, or choose our processing options during checkout: slaughtered, dressed, or frozen according to your preference."
  },
  {
    question: "How much does delivery cost?",
    answer: "Delivery within Ibadan is a flat rate of ₦2,000. If you are located outside Ibadan, please contact us on WhatsApp to arrange logistics. Farm pickup is always completely free!"
  },
  {
    question: "How do I make payment?",
    answer: "Payment is fast and secure. You can make a direct bank transfer to our corporate account (Samtob p&c Ltd, 0127186331, Wema Bank) and upload your receipt on the checkout page."
  },
  {
    question: "How long does processing and delivery take?",
    answer: "We pride ourselves on same-day processing. Whether you order slaughtered, dressed, or frozen, your chicken is prepared fresh that day and dispatched to you immediately."
  },
  {
    question: "Are your chickens raised with artificial hormones?",
    answer: "Absolutely not! Our birds are 100% farm-raised with no artificial hormones, antibiotics, or unnatural additives. We believe in providing pure, healthy poultry for your family."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="faq-section section-padding">
      <div className="container">
        <div className="faq-header text-center">
          <span className="badge badge-gold">Got Questions?</span>
          <h2 className="faq-title">
            Frequently Asked <span className="title-accent-gold">Questions</span>
          </h2>
          <p className="faq-subtitle">
            Everything you need to know about ordering from Samtob Farmzs.
          </p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`faq-item ${isOpen ? 'open' : ''}`}
                onClick={() => toggleFAQ(index)}
              >
                <div className="faq-question">
                  <h3>{faq.question}</h3>
                  <div className={`faq-icon ${isOpen ? 'rotate' : ''}`}>
                    <ChevronDown size={20} />
                  </div>
                </div>
                <div 
                  className="faq-answer-wrapper" 
                  style={{ maxHeight: isOpen ? '200px' : '0' }}
                >
                  <p className="faq-answer">{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
