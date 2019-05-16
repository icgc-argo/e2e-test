import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

const borderStyle = ({ theme: { colors } }) => css`
  border: solid 1px ${colors.grey_1};
  &:hover {
    border: solid 1px ${colors.light_blue};
  }

  &:focus {
    border: solid 1px ${colors.grey};
  }

  &:active {
    border: solid 1px ${colors.grey};
  }

  &:disabled {
    color: ${colors.light_blue_grey};
    border: solid 1px ${colors.grey_2};
    background-color: ${colors.pale_grey};
  }
`;

const StyledInput = styled("input")`
  border-radius: 8px;
  padding: 8px 10px;
  background-color: white;
  outline: none;
  height: ${({ size }) => (size === "sm" ? "30px" : "36px")};
`;

/**
 * Basic controlled input component
 */
const Input = ({ placeholder, value, disabled, size }) => (
  <StyledInput placeholder={placeholder} value={value} disabled={disabled} />
);

Input.propTypes = {
  placeholder: PropTypes.string,
  size: PropTypes.oneOf(["sm", "lg"])
};

export default Input;