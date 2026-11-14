type Props = {
    eyebrow: string;
    title: string;
    description: string;
};

const SectionHeading = ({ eyebrow, title, description }: Props) => (
    <div>
        <p className="text-[10px] font-bold tracking-[0.2em] text-[#526B91]">
            {eyebrow}
        </p>
        <h2 className="font-playfair mt-1.5 text-2xl font-semibold text-[#203452]">
            {title}
        </h2>
        <p className="mt-1.5 text-sm leading-6 text-[#667085]">{description}</p>
    </div>
);

export default SectionHeading;
