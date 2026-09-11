import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './FAQ.css';

export default function FAQ() {
  const { siteSettings } = useApp();
  const ibadanFee = Number(siteSettings?.ibadan ?? 5000).toLocaleString('en-NG');

  const faqs = [
  {
    question: "What is the December Rush?",
    answer: "The December Rush is a special plan that lets you book your Christmas chickens early and pay in small weekly installments for 12 weeks."
  },
  {
    question: "How much does the chicken reservation cost?",
    answer: "Weekly payments are based on the chicken's weight:<br/><br/>• 3.8kg–4.1kg: <strong>₦1,500</strong><br/>• 4.2kg–4.5kg: <strong>₦5,000</strong><br/>• 4.6kg–5kg: <strong>₦2,500</strong><br/>• 5.1kg–5.5kg: <strong>₦3,000</strong>"
  },
  {
    question: "What is the minimum order for chickens?",
    answer: "The minimum order is <strong>5 chickens</strong>, though we can sometimes make an exception for an order of 2."
  },
  {
    question: "When can I book my Christmas chickens?",
    answer: "Booking is open from <strong>September 15th</strong> to <strong>September 30th</strong>."
  },
  {
    question: "Where and when do I pick up my chickens?",
    answer: "Pick-ups are at the farm in <strong>Aderin Village, Pagun Òkè omi off olodo, Ibadan</strong>, between <strong>December 20th and 29th</strong>. We also offer park pick up and door step delivery at a fee."
  },
  {
    question: "Can I pick up my chickens at a near popular bustop if I don't want to visit the farm?",
    answer: "Yes, park pick up is available for bulk buyers where we move the chicken from the farm closer to your location."
  },
  {
    question: "Do you offer delivery for chickens?",
    answer: `Yes, we deliver within Ibadan for a flat fee of <strong>₦${ibadanFee}</strong>. Delivery outside Ibadan depends on your specific location (limited to South West Nigeria for now).`
  },
  {
    question: "How do I pay for my chicken booking?",
    answer: "Please pay to: <strong>Samtob p&c Ltd</strong>, <strong>0127186331</strong>, <strong>Wema Bank</strong>, and upload proof of payment to your dashboard on our website."
  },
  {
    question: "What should I do after I pay?",
    answer: "Once you've paid, upload it on your dashboard so we can confirm your booking payment and join our farm WhatsApp group."
  },
  {
    question: "Why should I book my chickens with SAMTOB Farm?",
    answer: "Our chickens are a high-protein, cost-effective alternative to cow meat, perfect for Christmas celebrations and other events."
  },
  {
    question: "Where can I find the chicken order link?",
    answer: "You can place your order directly through our website: <strong>https://samtob-Farms.vercel.app</strong>"
  },
  {
    question: "Does SAMTOB Farm have an Instagram page?",
    answer: "Yes! You can follow us for updates and photos at <strong>www.instagram.com/samtobfarms</strong>."
  },
  {
    question: "What is the farm WhatsApp group for?",
    answer: "The group is where we share important updates regarding your booking confirmation and farm conversation."
  },
  {
    question: "Can I book my chickens after September 30th?",
    answer: "Yes, but the promo price expires Sept 30 and normal price resumes from October 1st with a 4-8 weeks payment plan."
  },
  {
    question: "Are these chickens good for large events?",
    answer: "Yes, our chickens are specifically raised to be a high-protein, cost-effective alternative to cow meat for large gatherings. So you can confidently book ahead of your next event or book to meet your organization's needs."
  },
  {
    question: `Is the ₦${ibadanFee} delivery fee the same for all of Ibadan?`,
    answer: `Yes, we charge a flat fee of ₦${ibadanFee} for any delivery within Ibadan.`
  },
  {
    question: "Which bank account should I use for chicken payments?",
    answer: "Please ensure you pay into the <strong>Wema Bank</strong> account (<strong>0127186331</strong>) under the name <strong>Samtob p&c Ltd</strong>."
  },
  {
    question: "Can I pick up my chickens during the Christmas week?",
    answer: "Yes, you can pick up your chickens any day between <strong>December 20th and December 29th</strong> at the farm for the December Christmas Rush or contact us via email or WhatsApp for special bulk orders for other events."
  },
  {
    question: "How do I contact the farm for help?",
    answer: "The best way to get support is by joining our WhatsApp group or messaging us on Instagram."
  },
  {
    question: "Does the payment plan cover all chickens?",
    answer: "Yes, the 12-week installment plan applies to all four weight categories, from 3.8kg up to 5.5kg."
  }
  ];

  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="faq-section section-padding">
      <div className="container">
        <div className="faq-header text-center">
          <span className="badge badge-gold">December Rush Offer</span>
          <h2 className="faq-title">
            Frequently Asked <span className="title-accent-gold">Questions</span>
          </h2>
          <p className="faq-subtitle">
            Everything you need to know about booking your Christmas chickens with SAMTOB Farms.
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
                  style={{ maxHeight: isOpen ? '400px' : '0' }}
                >
                  <p className="faq-answer" dangerouslySetInnerHTML={{ __html: faq.answer }}></p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
