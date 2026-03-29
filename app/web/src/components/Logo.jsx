import logo from '../assets/Logo.png';      

export default function Logo({ width = 200 }) {
  return (
    <img src={logo} alt="EcentKnight Logo" width={width} />
  );
}
