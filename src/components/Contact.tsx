'use client';

import { useState } from 'react';
import styles from './Contact.module.css';

interface ContactProps {
  locale?: 'en' | 'zh';
  onBack?: () => void;
}

export default function Contact({ locale = 'zh', onBack }: ContactProps) {
  const t = (zh: string, en: string) => locale === 'zh' ? zh : en;
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {onBack && (
          <button className={styles.backBtn} onClick={onBack}>
            ← {t('返回', 'Back')}
          </button>
        )}
        <h1 className={styles.title}>{t('联系我们', 'Contact Us')}</h1>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('联系方式', 'Contact Methods')}</h2>
          <div className={styles.contactGrid}>
            <div className={styles.contactCard}>
              <span className={styles.contactIcon}>📧</span>
              <h3>{t('电子邮件', 'Email')}</h3>
              <p>contact@crackcode.game</p>
            </div>
            <div className={styles.contactCard}>
              <span className={styles.contactIcon}>💬</span>
              <h3>{t('微信客服', 'WeChat')}</h3>
              <p>CrackCode_Game</p>
            </div>
            <div className={styles.contactCard}>
              <span className={styles.contactIcon}>🐦</span>
              <h3>{t('社交媒体', 'Social Media')}</h3>
              <p>@CrackCodeGame</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('在线留言', 'Send Message')}</h2>
          {submitted ? (
            <div className={styles.successMessage}>
              <span className={styles.successIcon}>✓</span>
              <p>{t('感谢您的留言！我们会尽快回复您。', 'Thank you for your message! We will respond as soon as possible.')}</p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>{t('您的姓名', 'Your Name')}</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder={t('请输入姓名', 'Enter your name')}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>{t('电子邮箱', 'Email')}</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder={t('请输入邮箱', 'Enter your email')}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>{t('主题', 'Subject')}</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  placeholder={t('请输入主题', 'Enter subject')}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>{t('留言内容', 'Message')}</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder={t('请输入留言内容', 'Enter your message')}
                  rows={5}
                  required
                />
              </div>
              <button type="submit" className={styles.submitBtn}>
                {t('发送留言', 'Send Message')}
              </button>
            </form>
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('工作时间', 'Working Hours')}</h2>
          <div className={styles.officeHours}>
            <div className={styles.hourRow}>
              <span>{t('周一至周五', 'Monday - Friday')}</span>
              <span>09:00 - 18:00</span>
            </div>
            <div className={styles.hourRow}>
              <span>{t('周六周日', 'Saturday - Sunday')}</span>
              <span>10:00 - 16:00</span>
            </div>
          </div>
          <p className={styles.notice}>
            {t('注意：非工作时间内的留言将在下一个工作日回复。', 'Note: Messages outside working hours will be replied on the next business day.')}
          </p>
        </section>
      </div>
    </div>
  );
}