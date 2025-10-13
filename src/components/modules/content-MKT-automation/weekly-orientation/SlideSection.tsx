interface SlideSectionProps {
  className?: string;
  slideClass?: string;
  children?: any;
}

export default function SlideSection(props: SlideSectionProps) {
  const { className, slideClass, children } = props;
  const combined = `${slideClass ?? ''} ${className ?? ''}`.trim();
  return (
    <div className={combined}>
      {children}
    </div>
  );
}


