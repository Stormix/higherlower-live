const Smotix = () => {
  return (
    <div className="flex items-center gap-2 mx-2">
      <img src="/images/smotix.gif" width={32} height={32} alt="Stormix" />
      <a href="https://stormix.co" className="text-primary">
        Stormix
      </a>
    </div>
  );
};

const Ekb = () => {
  return (
    <div className="flex items-center gap-2 mx-2">
      <img src="/images/ekb.png" width={32} height={32} alt="EKB9816" />
      <a href="#" className="text-primary">
        EKB9816
      </a>
    </div>
  );
};

const Footer = () => {
  return (
    <div className="flex items-center justify-center w-full py-8 text-base text-white/70">
      Made with love by <Smotix /> & <Ekb />
    </div>
  );
};

export default Footer;
