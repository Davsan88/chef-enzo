import React from 'react'
import chefEnzoLogo from '../assets/chef-enzo.svg'

const Header = () => {
  return (
    <header role="banner">
      <img src={chefEnzoLogo} alt="Chef Enzo Logo" />
      <h1>Chef Enzo</h1>
    </header>
  )
}

export default Header
