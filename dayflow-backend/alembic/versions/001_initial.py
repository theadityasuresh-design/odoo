"""Initial migration - create all tables

Revision ID: 001_initial
Revises:
Create Date: 2026-08-22 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # -- users --------------------------------------------------------------
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("employee_id", sa.String(), unique=True, index=True, nullable=False),
        sa.Column("email", sa.String(), unique=True, index=True, nullable=False),
        sa.Column("password_hash", sa.String(), nullable=False),
        sa.Column("role", sa.String(), nullable=False),
        sa.Column("is_email_verified", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")),
    )

    # -- employee_profiles --------------------------------------------------
    op.create_table(
        "employee_profiles",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("full_name", sa.String(), nullable=True),
        sa.Column("phone", sa.String(), nullable=True),
        sa.Column("address", sa.String(), nullable=True),
        sa.Column("job_title", sa.String(), nullable=True),
        sa.Column("department", sa.String(), nullable=True),
        sa.Column("date_of_joining", sa.Date(), nullable=True),
        sa.Column("profile_picture_url", sa.String(), nullable=True),
    )
    op.create_index("ix_employee_profiles_user_id", "employee_profiles", ["user_id"])

    # -- attendances --------------------------------------------------------
    op.create_table(
        "attendances",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("att_date", sa.Date(), nullable=False),
        sa.Column("check_in", sa.DateTime(), nullable=True),
        sa.Column("check_out", sa.DateTime(), nullable=True),
        sa.Column("status", sa.String(), nullable=False),
    )
    op.create_index("ix_attendances_user_id", "attendances", ["user_id"])
    op.create_index("ix_attendances_att_date", "attendances", ["att_date"])

    # -- leave_requests -----------------------------------------------------
    op.create_table(
        "leave_requests",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("leave_type", sa.String(), nullable=False),
        sa.Column("start_date", sa.Date(), nullable=False),
        sa.Column("end_date", sa.Date(), nullable=False),
        sa.Column("remarks", sa.String(), nullable=True),
        sa.Column("status", sa.String(), nullable=False, server_default=sa.text("'pending'")),
        sa.Column("reviewed_by", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("reviewer_comments", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")),
    )
    op.create_index("ix_leave_requests_user_id", "leave_requests", ["user_id"])
    op.create_index("ix_leave_requests_status", "leave_requests", ["status"])

    # -- payrolls -----------------------------------------------------------
    op.create_table(
        "payrolls",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("base_salary", sa.Numeric(10, 2), nullable=False, server_default=sa.text("0")),
        sa.Column("allowances", sa.Numeric(10, 2), nullable=False, server_default=sa.text("0")),
        sa.Column("deductions", sa.Numeric(10, 2), nullable=False, server_default=sa.text("0")),
        sa.Column("net_salary", sa.Numeric(10, 2), nullable=False, server_default=sa.text("0")),
        sa.Column("pay_cycle", sa.String(), nullable=False, server_default=sa.text("'monthly'")),
        sa.Column("last_updated", sa.DateTime(), nullable=False, server_default=sa.text("now()")),
    )
    op.create_index("ix_payrolls_user_id", "payrolls", ["user_id"])

    # -- documents ----------------------------------------------------------
    op.create_table(
        "documents",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("doc_type", sa.String(), nullable=False),
        sa.Column("file_url", sa.String(), nullable=False),
        sa.Column("uploaded_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")),
    )
    op.create_index("ix_documents_user_id", "documents", ["user_id"])


def downgrade() -> None:
    op.drop_table("documents")
    op.drop_table("payrolls")
    op.drop_table("leave_requests")
    op.drop_table("attendances")
    op.drop_table("employee_profiles")
    op.drop_table("users")
