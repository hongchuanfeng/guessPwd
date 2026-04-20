'use client';

import styles from './Legal.module.css';

interface TermsOfServiceProps {
  locale?: 'en' | 'zh';
  onBack?: () => void;
}

export default function TermsOfService({ locale = 'zh', onBack }: TermsOfServiceProps) {
  const t = (zh: string, en: string) => locale === 'zh' ? zh : en;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {onBack && (
          <button className={styles.backBtn} onClick={onBack}>
            ← {t('返回', 'Back')}
          </button>
        )}
        <h1 className={styles.title}>{t('服务条款', 'Terms of Service')}</h1>
      </div>

      <div className={styles.content}>
        <p className={styles.lastUpdate}>{t('最后更新日期：2024年1月1日', 'Last Updated: January 1, 2024')}</p>

        <section className={styles.section}>
          <h2>{t('接受条款', 'Acceptance of Terms')}</h2>
          <p>{t('欢迎使用CrackCode服务（以下简称"服务"）。在使用我们的服务之前，请仔细阅读本服务条款（以下简称"条款"）。访问或使用我们的服务即表示您同意接受本条款的约束。', 'Welcome to CrackCode services (hereinafter referred to as "Service"). Before using our service, please carefully read these Terms of Service (hereinafter referred to as "Terms"). By accessing or using our service, you agree to be bound by these Terms.')}</p>
        </section>

        <section className={styles.section}>
          <h2>{t('服务描述', 'Description of Service')}</h2>
          <p>{t('CrackCode是一款在线密码推理游戏服务。我们致力于为您提供有趣、流畅的游戏体验。服务可能因维护、升级或任何其他原因而随时变更或中断，恕不另行通知。', 'CrackCode is an online password deduction game service. We are committed to providing you with an interesting and smooth gaming experience. The service may be changed or interrupted at any time for maintenance, upgrades, or any other reasons without prior notice.')}</p>
        </section>

        <section className={styles.section}>
          <h2>{t('用户行为', 'User Conduct')}</h2>
          <p>{t('您在使用服务时同意不会：', 'You agree not to:')}</p>
          <ul>
            <li>{t('违反任何适用的法律法规', 'Violate any applicable laws or regulations')}</li>
            <li>{t('侵犯他人权利，包括但不限于知识产权和隐私权', 'Infringe on the rights of others, including but not limited to intellectual property and privacy rights')}</li>
            <li>{t('尝试通过任何手段获取未授权的访问', 'Attempt to gain unauthorized access through any means')}</li>
            <li>{t('干扰或破坏服务的正常运行', 'Interfere with or disrupt the normal operation of the service')}</li>
            <li>{t('使用自动化工具或机器人访问服务', 'Use automated tools or bots to access the service')}</li>
            <li>{t('传播恶意软件或进行任何可能损害服务的行为', 'Spread malware or engage in any behavior that may harm the service')}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>{t('知识产权', 'Intellectual Property')}</h2>
          <p>{t('服务中的所有内容、设计、代码、图形、界面和功能均受知识产权法保护，未经授权不得复制、修改、分发或用于商业目的。', 'All content, design, code, graphics, interface, and functionality in the service are protected by intellectual property laws and may not be copied, modified, distributed, or used for commercial purposes without authorization.')}</p>
        </section>

        <section className={styles.section}>
          <h2>{t('服务变更', 'Service Changes')}</h2>
          <p>{t('我们保留随时修改或终止服务（或其任何部分）的权利，恕不另行通知。我们可能随时限制您访问某些功能或服务，恕不承担任何责任。', 'We reserve the right to modify or terminate the service (or any part thereof) at any time without prior notice. We may restrict access to certain features or services at any time without liability.')}</p>
        </section>

        <section className={styles.section}>
          <h2>{t('免责声明', 'Disclaimer')}</h2>
          <p>{t('服务按"原样"和"可用"提供，不提供任何明示或暗示的保证。在法律允许的最大范围内，我们不承担所有保证，包括但不限于适销性、特定用途适用性和非侵权的保证。', 'The service is provided "as is" and "as available" without any express or implied warranties. To the fullest extent permitted by law, we disclaim all warranties, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.')}</p>
        </section>

        <section className={styles.section}>
          <h2>{t('责任限制', 'Limitation of Liability')}</h2>
          <p>{t('在任何情况下，我们均不对任何间接、偶然、特殊、后果性或惩罚性损害承担责任，包括但不限于利润损失、数据丢失、业务中断等，即使我们已被告知可能发生此类损害。', 'In no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, loss of data, business interruption, etc., even if we have been advised of the possibility of such damages.')}</p>
        </section>

        <section className={styles.section}>
          <h2>{t('条款修改', 'Modifications to Terms')}</h2>
          <p>{t('我们保留随时修改本条款的权利。修改后的条款将在发布后生效。继续使用服务即表示您接受修改后的条款。', 'We reserve the right to modify these Terms at any time. Modified Terms will take effect upon posting. Continued use of the service constitutes acceptance of the modified Terms.')}</p>
        </section>

        <section className={styles.section}>
          <h2>{t('适用法律', 'Governing Law')}</h2>
          <p>{t('本条款受中华人民共和国法律管辖。因本条款引起的任何争议，应提交有管辖权的人民法院解决。', 'These Terms shall be governed by the laws of the People\'s Republic of China. Any disputes arising from these Terms shall be submitted to the competent people\'s court for resolution.')}</p>
        </section>

        <section className={styles.section}>
          <h2>{t('联系我们', 'Contact Us')}</h2>
          <p>{t('如果您对本服务条款有任何疑问，请联系我们：', 'If you have any questions about these Terms of Service, please contact us:')}</p>
          <p className={styles.contactInfo}>📧 legal@crackcode.game</p>
        </section>
      </div>
    </div>
  );
}