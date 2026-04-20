'use client';

import styles from './Legal.module.css';

interface PrivacyPolicyProps {
  locale?: 'en' | 'zh';
  onBack?: () => void;
}

export default function PrivacyPolicy({ locale = 'zh', onBack }: PrivacyPolicyProps) {
  const t = (zh: string, en: string) => locale === 'zh' ? zh : en;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {onBack && (
          <button className={styles.backBtn} onClick={onBack}>
            ← {t('返回', 'Back')}
          </button>
        )}
        <h1 className={styles.title}>{t('隐私政策', 'Privacy Policy')}</h1>
      </div>

      <div className={styles.content}>
        <p className={styles.lastUpdate}>{t('最后更新日期：2024年1月1日', 'Last Updated: January 1, 2024')}</p>

        <section className={styles.section}>
          <h2>{t('引言', 'Introduction')}</h2>
          <p>{t('CrackCode（以下简称"我们"）非常重视用户的隐私和个人信息保护。本隐私政策旨在向您说明我们如何收集、使用、存储和保护您的个人信息。', 'CrackCode (hereinafter referred to as "we") takes your privacy and personal information protection very seriously. This Privacy Policy is designed to explain how we collect, use, store, and protect your personal information.')}</p>
        </section>

        <section className={styles.section}>
          <h2>{t('信息收集', 'Information Collection')}</h2>
          <p>{t('我们收集的信息包括：', 'Information we collect includes:')}</p>
          <ul>
            <li>{t('设备信息：包括设备型号、操作系统版本、浏览器类型等', 'Device information: including device model, OS version, browser type, etc.')}</li>
            <li>{t('使用数据：游戏进度、得分、游玩时长等技术数据', 'Usage data: game progress, scores, play time, and other technical data')}</li>
            <li>{t('cookies和追踪数据：用于提升用户体验和网站分析', 'Cookies and tracking data: used to improve user experience and website analytics')}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>{t('信息使用', 'Use of Information')}</h2>
          <p>{t('我们使用收集的信息用于：', 'We use the collected information to:')}</p>
          <ul>
            <li>{t('提供、维护和改进我们的服务', 'Provide, maintain, and improve our services')}</li>
            <li>{t('分析和监控服务使用情况', 'Analyze and monitor service usage')}</li>
            <li>{t('检测和预防安全问题与欺诈行为', 'Detect and prevent security issues and fraudulent activities')}</li>
            <li>{t('提供客户支持和技术服务', 'Provide customer support and technical services')}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>{t('信息保护', 'Information Protection')}</h2>
          <p>{t('我们采用行业标准的安全措施来保护您的信息，包括：', 'We employ industry-standard security measures to protect your information, including:')}</p>
          <ul>
            <li>{t('数据加密传输（HTTPS/SSL）', 'Encrypted data transmission (HTTPS/SSL)')}</li>
            <li>{t('安全的服务器存储', 'Secure server storage')}</li>
            <li>{t('访问控制和权限管理', 'Access control and permission management')}</li>
            <li>{t('定期安全审计', 'Regular security audits')}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>{t('第三方服务', 'Third-Party Services')}</h2>
          <p>{t('我们的服务可能包含第三方服务链接，这些第三方有自己的隐私政策。我们不对第三方服务的行为负责。', 'Our services may contain links to third-party services, which have their own privacy policies. We are not responsible for the actions of third-party services.')}</p>
        </section>

        <section className={styles.section}>
          <h2>{t('您的权利', 'Your Rights')}</h2>
          <p>{t('您有权：', 'You have the right to:')}</p>
          <ul>
            <li>{t('访问您的个人信息', 'Access your personal information')}</li>
            <li>{t('更正不准确的信息', 'Correct inaccurate information')}</li>
            <li>{t('删除您的个人信息', 'Delete your personal information')}</li>
            <li>{t('撤回同意', 'Withdraw consent')}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>{t('政策更新', 'Policy Updates')}</h2>
          <p>{t('我们可能会不时更新本隐私政策。更新后的政策将在本页面上发布。如有重大变更，我们将通过网站公告或电子邮件通知您。', 'We may update this Privacy Policy from time to time. Updated policies will be posted on this page. For significant changes, we will notify you through website announcements or email.')}</p>
        </section>

        <section className={styles.section}>
          <h2>{t('联系我们', 'Contact Us')}</h2>
          <p>{t('如果您对本隐私政策有任何疑问，请通过以下方式联系我们：', 'If you have any questions about this Privacy Policy, please contact us at:')}</p>
          <p className={styles.contactInfo}>📧 privacy@crackcode.game</p>
        </section>
      </div>
    </div>
  );
}