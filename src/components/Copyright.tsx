'use client';

import styles from './Legal.module.css';

interface CopyrightProps {
  locale?: 'en' | 'zh';
  onBack?: () => void;
}

export default function Copyright({ locale = 'zh', onBack }: CopyrightProps) {
  const t = (zh: string, en: string) => locale === 'zh' ? zh : en;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {onBack && (
          <button className={styles.backBtn} onClick={onBack}>
            ← {t('返回', 'Back')}
          </button>
        )}
        <h1 className={styles.title}>{t('版权声明', 'Copyright Notice')}</h1>
      </div>

      <div className={styles.content}>
        <p className={styles.lastUpdate}>{t('最后更新日期：2024年1月1日', 'Last Updated: January 1, 2024')}</p>

        <section className={styles.section}>
          <h2>{t('版权归属', 'Copyright Ownership')}</h2>
          <p>{t('CrackCode及其相关Logo、界面设计、游戏内容、代码、文本、图形、图标、图片、音频、视频等所有元素（以下简称"内容"）的版权均归CrackCode团队所有，受中华人民共和国著作权法及相关国际条约的保护。', 'The copyrights of CrackCode and its related Logo, interface design, game content, code, text, graphics, icons, pictures, audio, video, and all other elements (hereinafter referred to as "Content") are owned by the CrackCode team and are protected by the Copyright Law of the People\'s Republic of China and related international treaties.')}</p>
        </section>

        <section className={styles.section}>
          <h2>{t('版权声明', 'Copyright Statement')}</h2>
          <ul>
            <li>{t('未经明确授权，任何人不得以任何方式复制、修改、分发、传播、展示、镜像或使用本网站的任何内容', 'Without express authorization, no one may copy, modify, distribute, disseminate, display, mirror, or use any content of this website in any way')}</li>
            <li>{t('禁止将本服务用于任何商业目的或未经授权的盈利活动', 'It is prohibited to use this service for any commercial purposes or unauthorized profit-making activities')}</li>
            <li>{t('禁止删除或更改任何版权信息、商标或其他所有权声明', 'It is prohibited to delete or alter any copyright information, trademarks, or other ownership notices')}</li>
            <li>{t('禁止使用自动化工具或机器人抓取、复制本网站的任何内容', 'It is prohibited to use automated tools or bots to crawl or copy any content of this website')}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>{t('许可使用', 'Licensed Use')}</h2>
          <p>{t('您可以：', 'You may:')}</p>
          <ul>
            <li>{t('在遵守本条款的前提下，将服务用于个人非商业娱乐目的', 'Use the service for personal non-commercial entertainment purposes in compliance with these Terms')}</li>
            <li>{t('分享游戏链接或截图，但不得对内容进行任何修改', 'Share game links or screenshots, but without modifying any content')}</li>
            <li>{t('在使用时注明来源为CrackCode', 'Credit CrackCode as the source when using')}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>{t('商标声明', 'Trademark Notice')}</h2>
          <p>{t('CrackCode名称、Logo及相关标识均为我们的注册商标或商标。未经书面许可，任何人不得使用、展示或复制这些商标。', 'The CrackCode name, Logo, and related marks are our registered trademarks or trademarks. No one may use, display, or copy these trademarks without written permission.')}</p>
        </section>

        <section className={styles.section}>
          <h2>{t('第三方版权', 'Third-Party Copyrights')}</h2>
          <p>{t('我们尊重他人的知识产权。如果您认为我们的服务侵犯了您的版权，请联系我们，我们将立即处理。', 'We respect the intellectual property rights of others. If you believe that our service has infringed your copyright, please contact us and we will handle it immediately.')}</p>
          <p className={styles.contactInfo}>📧 copyright@crackcode.game</p>
        </section>

        <section className={styles.section}>
          <h2>{t('用户内容', 'User Content')}</h2>
          <ul>
            <li>{t('用户提交的内容（如反馈、建议等）一旦提交，即表示您授予我们无限制的使用权', 'Once user-submitted content (such as feedback, suggestions, etc.) is submitted, you grant us unrestricted usage rights')}</li>
            <li>{t('我们不对用户提交的内容主张任何所有权', 'We do not claim any ownership of user-submitted content')}</li>
            <li>{t('用户应确保提交的内容不侵犯任何第三方权利', 'Users should ensure that submitted content does not infringe on any third-party rights')}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>{t('侵权投诉', 'Infringement Complaints')}</h2>
          <p>{t('如您发现任何侵权行为，请提供以下信息联系我们：', 'If you discover any infringement, please contact us with the following information:')}</p>
          <ul>
            <li>{t('您的详细联系信息', 'Your detailed contact information')}</li>
            <li>{t('被侵权作品的描述和位置', 'Description and location of the infringed work')}</li>
            <li>{t('侵权内容的描述和位置', 'Description and location of the infringing content')}</li>
            <li>{t('您的声明，表明您是权利所有者或授权代表', 'Your statement indicating that you are the rights owner or authorized representative')}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>{t('法律后果', 'Legal Consequences')}</h2>
          <p>{t('任何违反本版权声明的行为可能导致：', 'Any violation of this Copyright Notice may result in:')}</p>
          <ul>
            <li>{t('终止您使用服务的权利', 'Termination of your right to use the service')}</li>
            <li>{t('民事诉讼和索赔', 'Civil litigation and claims')}</li>
            <li>{t('在法律允许的最大范围内，可能面临行政处罚或刑事追诉', 'Administrative penalties or criminal prosecution to the fullest extent permitted by law')}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>{t('联系我们', 'Contact Us')}</h2>
          <p>{t('如对本版权声明有任何疑问，请联系我们：', 'If you have any questions about this Copyright Notice, please contact us:')}</p>
          <p className={styles.contactInfo}>📧 copyright@crackcode.game</p>
        </section>
      </div>
    </div>
  );
}