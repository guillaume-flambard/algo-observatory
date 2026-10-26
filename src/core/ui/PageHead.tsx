import type { ReactNode } from 'react';

interface PageHeadProps {
  title: ReactNode;
  lead?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
  titleId?: string;
}

/** The one page header every route uses: title, one-paragraph lead, optional actions and extras. */
export function PageHead({ title, lead, actions, aside, children, titleId }: PageHeadProps) {
  return (
    <header className="page-head">
      <div className="page-container">
        <div className="page-head-row">
          <div className="page-head-text">
            <h1 id={titleId} className="page-title">{title}</h1>
            {lead && <p className="page-lead">{lead}</p>}
          </div>
          {(actions || aside) && <div className="page-head-side">{aside}{actions && <div className="page-actions">{actions}</div>}</div>}
        </div>
        {children && <div className="page-head-extra">{children}</div>}
      </div>
    </header>
  );
}
