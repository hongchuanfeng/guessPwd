'use client';

import styles from './Legal.module.css';

interface DisclaimerProps {
  locale?: 'en' | 'zh';
  onBack?: () => void;
}

export default function Disclaimer({ locale = 'zh', onBack }: DisclaimerProps) {
  const t = (zh: string, en: string) => locale === 'zh' ? zh : en;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {onBack && (
          <button className={styles.backBtn} onClick={onBack}>
            ← {t('返回', 'Back')}
          </button>
        )}
        <h1 className={styles.title}>{t('免责声明', 'Disclaimer')}</h1>
      </div>

      <div className={styles.content}>
        <p className={styles.lastUpdate}>{t('最后更新日期：2024年1月1日', 'Last Updated: January 1, 2024')}</p>

        <section className={styles.section}>
          <h2>{t('一般声明', 'General Disclaimer')}</h2>
          <p>{t('CrackCode（以下简称"我们"）在此明确声明，对于您使用本网站和服务所产生的任何直接或间接后果，我们不承担任何责任。您使用我们的服务即表示您同意并接受本免责声明的所有条款。', 'CrackCode (hereinafter referred to as "we") hereby expressly states that we assume no responsibility for any direct or indirect consequences arising from your use of this website and services. Your use of our services indicates your agreement and acceptance of all terms of this disclaimer.')}</p>
        </section>

        <section className={styles.section}>
          <h2>{t('服务可用性', 'Service Availability')}</h2>
          <ul>
            <li>{t('我们不保证服务在任何时间都是可用的、连续的或无错误的', 'We do not guarantee that the service is always available, continuous, or error-free')}</li>
            <li>{t('服务可能因维护、升级、设备故障、网络问题或其他原因而暂停或中断', 'The service may be suspended or interrupted due to maintenance, upgrades, equipment failure, network problems, or other reasons')}</li>
            <li>{t('我们不对因服务中断而造成的任何损失负责', 'We are not responsible for any losses caused by service interruptions')}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>{t('游戏数据', 'Game Data')}</h2>
          <ul>
            <li>{t('我们不对游戏数据的丢失、损坏或未能存储负责', 'We are not responsible for the loss, damage, or failure to store game data')}</li>
            <li>{t('建议您定期截图保存重要的游戏进度或成绩', 'It is recommended that you regularly screenshot to save important game progress or scores')}</li>
            <li>{t('我们保留随时重置、修改或删除任何游戏数据的权利', 'We reserve the right to reset, modify, or delete any game data at any time')}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>{t('第三方内容', 'Third-Party Content')}</h2>
          <ul>
            <li>{t('服务可能包含指向第三方网站的链接，这些链接仅为方便用户而提供', 'The service may contain links to third-party websites, provided solely for the convenience of users')}</li>
            <li>{t('我们对第三方网站的内容、准确性或观点不承担任何责任', 'We assume no responsibility for the content, accuracy, or opinions of third-party websites')}</li>
            <li>{t('第三方网站的使用受其各自的服务条款和隐私政策约束', 'The use of third-party websites is subject to their respective terms of service and privacy policies')}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>{t('技术问题', 'Technical Issues')}</h2>
          <ul>
            <li>{t('我们不对因技术问题、软件错误、系统故障或兼容性问题造成的任何损害负责', 'We are not responsible for any damages caused by technical issues, software errors, system failures, or compatibility problems')}</li>
            <li>{t('用户有责任确保其设备满足使用服务的最低技术要求', 'Users are responsible for ensuring their devices meet the minimum technical requirements for using the service')}</li>
            <li>{t('我们对用户设备上运行的任何第三方软件引起的问题不承担责任', 'We assume no responsibility for problems caused by any third-party software running on the user\'s device')}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>{t('游戏建议', 'Game Advice')}</h2>
          <p>{t('虽然我们努力确保游戏说明和规则的准确性，但游戏中的任何策略建议或技巧仅供娱乐参考。我们不对玩家根据任何建议采取行动而产生的结果负责。', 'While we strive to ensure the accuracy of game instructions and rules, any strategic advice or tips in the game are for entertainment reference only. We are not responsible for the results of any actions taken by players based on any advice.')}</p>
        </section>

        <section className={styles.section}>
          <h2>{t('损害赔偿', 'Damages')}</h2>
          <p>{t('在任何情况下，我们均不对以下损害承担责任：', 'Under no circumstances shall we be liable for the following damages:')}</p>
          <ul>
            <li>{t('因使用或无法使用服务而造成的任何直接、间接、偶然、特殊或后果性损害', 'Any direct, indirect, incidental, special, or consequential damages arising from the use or inability to use the service')}</li>
            <li>{t('任何利润损失、业务中断、数据丢失', 'Any loss of profits, business interruption, loss of data')}</li>
            <li>{t('任何替代服务或产品的采购成本', 'The cost of any substitute services or products')}</li>
            <li>{t('任何因使用服务而产生的其他金钱损失', 'Any other monetary loss arising from the use of the service')}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>{t('更新和变更', 'Updates and Changes')}</h2>
          <p>{t('我们保留随时更新本免责声明的权利，恕不另行通知。更新后的免责声明将在发布时生效。建议您定期查看本页面以了解最新信息。', 'We reserve the right to update this disclaimer at any time without prior notice. The updated disclaimer will take effect upon posting. It is recommended that you check this page regularly for the latest information.')}</p>
        </section>

        <section className={styles.section}>
          <h2>{t('联系我们', 'Contact Us')}</h2>
          <p>{t('如果您对本免责声明有任何疑问，请联系我们：', 'If you have any questions about this disclaimer, please contact us:')}</p>
          <p className={styles.contactInfo}>📧 legal@crackcode.game</p>
        </section>
      </div>
    </div>
  );
}